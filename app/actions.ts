"use server"
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData, defaultSession } from "./lib";
import { cookies } from "next/headers";
import prisma from "./lib/prisma";
import { parseWithZod } from "@conform-to/zod/v4";
import { categorySchema, loginSchema, productSchema, userSchema, userSchemaWithoutPass } from "./lib/zodSchemas";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { toast } from "sonner";


const saltRounds = 12;

async function hashPassword(password:string){
    return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password:string, hash:string){
    return await bcrypt.compare(password, hash);
}

export async function getSesion() {
    const cookieStore  = await cookies();

    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)


    return session
}

export async function isLoggedIn(){
    const session = await getSesion();

    if(!session.isLoggedIn){
        session.isLoggedIn = defaultSession.isLoggedIn;
        redirect("/login");
    }
    return session;
}

export async function login(prevState: unknown, formData:FormData){

    const session = await getSesion();

    const submission = parseWithZod(formData,{
        schema:loginSchema
    });

    if(submission.status !== "success"){
        return submission.reply();
    }

    // check if user exists
    const user = await prisma.user.findFirst({
        where:{
            username:submission.value.username,
            isDeleted:false
        }
    })

    if(!user ){
        return submission.reply({
            formErrors:["Usuario o contraseña incorrectos"],
        });
    }

    const dummyHash = "$2a$12$9bbYvWc5LspT9BlWv9nUMOjT3CM4fRUTh/ZPQq7EwDbQ7qv5d32ZK"; // hash of "dummy"

    // Pick real hash if user exists, otherwise dummy
    const hashToCheck = user?.password ?? dummyHash;

    const verification = await verifyPassword(submission.value.password, hashToCheck);

    if(!verification ){
        return submission.reply({
            formErrors:["Usuario o contraseña incorrectos"],
        });
    }

    await createLog(user.id, "Inicio Session");

    session.userId = user.id;
    session.userName = user.username;
    session.role = user.role;
    session.img = user.img || "";
    session.isLoggedIn = true;

    await session.save();

    redirect("/");
}

export async function logout(){
    const session = await getSesion();
    await createLog(session.userId as string, "Cerro Session");
    session.destroy();
    
    redirect("/login");
}


export async function createUser(prevState: unknown, formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const submission = parseWithZod(formData,{
        schema:userSchema
    });

    if(submission.status !== "success"){
        return submission.reply();
    }

    const hashedPassword = await hashPassword(submission.value.password);

    await prisma.user.create({
        data:{
            username:submission.value.username,
            password:hashedPassword,
            firstName:submission.value.firstname,
            lastName:submission.value.lastname || null,
            img:submission.value.img || null,
            role:submission.value.role,
        }
    })

    await createLog(session.userId as string, `Creo un nuevo Usuario ${submission.value.username}`);

    redirect("/usuarios?action=created&entity=usuario");
}

export async function editUser(prevState: any, formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const submission = parseWithZod(formData, {schema:userSchemaWithoutPass});
    if(submission.status !== "success"){
        return submission.reply();
    }

    const userid = formData.get("id") as string;

    await prisma.user.update({
        where:{
            id:userid,
        },
        data:{
            username:submission.value.username,
            firstName:submission.value.firstname,
            lastName:submission.value.lastname || null,
            img:submission.value.img || null,
            role:submission.value.role,
        }
    })

    await createLog(session.userId as string, `Edito los datos del Usuario ${submission.value.username}`);

    redirect("/usuarios?action=updated&entity=usuario");
}

export async function DeleteUser(formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const userid = formData.get("id") as string;

    await prisma.user.update({
        where:{
            id:userid,
        },
        data:{
            isDeleted:true,
        }
    })
    await createLog(session.userId as string, `Elimino el Usuario ${formData.get("username")}`);

    redirect("/usuarios?action=deleted&entity=usuario");
}

export async function changePassword(formData:FormData){

    const session = await getSesion();
    const newPass = formData.get("pass") as string;
    if(session.role !== "admin"){
        redirect("/")
    }

    if(!newPass || newPass.length < 8){
        return {error:"La contraseña debe tener al menos 8 caracteres"}
    }

    const userid = formData.get("id") as string;

    const hashedPassword = await hashPassword(newPass);

    await prisma.user.update({
        where:{
            id:userid,
        },
        data:{
            password:hashedPassword,
        }
    })
    await createLog(session.userId as string, `Cambio la contraseña del Usuario ${formData.get("username")}`);

    redirect("/usuarios");
}


async function createLog(userId:string, action:string){
    await prisma.log.create({
        data:{
            userId:userId,
            action:action,
        },
    })
}



export async function createCategory(prevState: unknown, formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const submission = parseWithZod(formData,{
        schema:categorySchema
    });

    if(submission.status !== "success"){
        return submission.reply();
    }


    await prisma.category.create({
        data:{
            name:submission.value.name,
            description:submission.value.description || "",
        }
    })

    await createLog(session.userId as string, `Creo una nueva Categoria ${submission.value.name}`);

    redirect("/inventario?action=created&entity=category");
}


export async function editCategory(prevState: any, formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const submission = parseWithZod(formData, {schema:categorySchema});
    if(submission.status !== "success"){
        return submission.reply();
    }

    const id = formData.get("id") as string;

    await prisma.category.update({
        where:{
            id:id,
        },
        data:{
            name:submission.value.name,
            description:submission.value.description || "",
        }
    })

    await createLog(session.userId as string, `Edito los datos de la Categoria ${submission.value.name}`);

    redirect("/inventario?action=updated&entity=categoria");
}

export async function DeleteCategory(formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const id = formData.get("id") as string;

    await prisma.category.update({
        where:{
            id:id,
        },
        data:{
            isDeleted:true,
        }
    })
    await createLog(session.userId as string, `Elimino la Categoria ${formData.get("name")}`);

    redirect("/inventario?action=deleted&entity=categoria");
}


export async function createProduct(prevState: unknown, formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const submission = parseWithZod(formData,{
        schema:productSchema
    });

    if(submission.status !== "success"){
        return submission.reply();
    }

    const compatibility = JSON.parse(formData.get("compatibility") as string);
    
    const imagesArray = submission.value.images.flatMap((urlString) => 
    urlString.split(",").map((url) => url.trim()))
    

    await prisma.product.create({
        data:{
            name:submission.value.name,
            barcode:submission.value.barcode,
            categoryId:submission.value.categoryId,
            compatibility:compatibility,
            images:imagesArray,
            brand:submission.value.brand,
            location:submission.value.location,
            variant:submission.value.variant || "",
            stock:submission.value.stock,
            sellprice:submission.value.sellprice,
            buyprice:submission.value.buyprice,
        }
    })

    await createLog(session.userId as string, `Creo una nuevo Producto ${submission.value.name}`);

    redirect("/inventario?action=created&entity=producto");
}

export async function editProduct(prevState: any, formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const submission = parseWithZod(formData, {schema:productSchema});
    if(submission.status !== "success"){
        return submission.reply();
    }

    const id = formData.get("id") as string;

    const compatibility = JSON.parse(formData.get("compatibility") as string);
    const imagesArray = submission.value.images.flatMap((urlString) => 
    urlString.split(",").map((url) => url.trim()))

    await prisma.product.update({
        where:{
            id:id,
        },
        data:{
            name:submission.value.name,
            barcode:submission.value.barcode,
            categoryId:submission.value.categoryId,
            compatibility:compatibility,
            images:imagesArray,
            brand:submission.value.brand,
            location:submission.value.location,
            variant:submission.value.variant || "",
            stock:submission.value.stock,
            sellprice:submission.value.sellprice,
            buyprice:submission.value.buyprice,
        }
    })

    await createLog(session.userId as string, `Edito los datos del Producto ${submission.value.name}`);

    redirect("/inventario?action=updated&entity=producto");
}

export async function DeleteProduct(formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const id = formData.get("id") as string;

    await prisma.product.update({
        where:{
            id:id,
        },
        data:{
            isDeleted:true,
        }
    })
    await createLog(session.userId as string, `Elimino la Categoria ${formData.get("name")}`);

    redirect("/inventario?action=deleted&entity=producto");
}