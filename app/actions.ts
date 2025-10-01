"use server"
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData, defaultSession } from "./lib";
import { cookies } from "next/headers";
import prisma from "./lib/prisma";
import { parseWithZod } from "@conform-to/zod/v4";
import { categorySchema, loginSchema, productSchema, proveedoresSchema, sucursalSchema, userSchema, userSchemaWithoutPass } from "./lib/zodSchemas";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";


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

//------------------------------------User Actions -------------------------------------
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

//------------------------------------log Actions -------------------------------------
async function createLog(userId:string, action:string){
    await prisma.log.create({
        data:{
            userId:userId,
            action:action,
        },
    })
}


//------------------------------------Category Actions -------------------------------------
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

//------------------------------------Product Actions -------------------------------------
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
            alertammount:submission.value.alertammount,
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
            alertammount:submission.value.alertammount,
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



//------------------------------------Sucursal Actions -------------------------------------

export async function createSucursal(prevState: unknown, formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const submission = parseWithZod(formData,{
        schema:sucursalSchema
    });

    if(submission.status !== "success"){
        return submission.reply();
    }


    await prisma.sucursales.create({
        data:{
            name:submission.value.name,
            description:submission.value.description || "",
            use:submission.value.use,
        }
    })

    await createLog(session.userId as string, `Creo una nueva Sucursal ${submission.value.name}`);

    redirect("/sucursales?action=created&entity=surcursal");
}


export async function editSucursal(prevState: any, formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const submission = parseWithZod(formData, {schema:sucursalSchema});
    if(submission.status !== "success"){
        return submission.reply();
    }

    const id = formData.get("id") as string;

    await prisma.sucursales.update({
        where:{
            id:id,
        },
        data:{
            name:submission.value.name,
            description:submission.value.description || "",
            use:submission.value.use,
        }
    })

    await createLog(session.userId as string, `Edito los datos de la Sucursal ${submission.value.name}`);

    redirect("/sucursales?action=updated&entity=sucursal");
}

export async function DeleteSucursal(formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const id = formData.get("id") as string;

    await prisma.sucursales.update({
        where:{
            id:id,
        },
        data:{
            isDeleted:true,
        }
    })
    await createLog(session.userId as string, `Elimino la Sucursal ${formData.get("name")}`);

    redirect("/sucursales?action=deleted&entity=sucursal");
}


//------------------------------------Proveedores Actions -------------------------------------

export async function createProveedor(prevState: unknown, formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const submission = parseWithZod(formData,{
        schema:proveedoresSchema
    });

    if(submission.status !== "success"){
        return submission.reply();
    }


    await prisma.proveedores.create({
        data:{
            companyName:submission.value.companyName,
            companyPhone:submission.value.companyPhone || "",
            companyEmail:submission.value.companyEmail || "",
            contactName: submission.value.contactName,
            contactPhone: submission.value.contactPhone || "",
            contactEmail: submission.value.contactEmail || "",
        }
    })

    await createLog(session.userId as string, `Creo una nueva Sucursal ${submission.value.companyName}`);

    redirect("/proveedores?action=created&entity=proveedor");
}


export async function editProveedor(prevState: any, formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const submission = parseWithZod(formData, {schema:proveedoresSchema});
    if(submission.status !== "success"){
        return submission.reply();
    }

    const id = formData.get("id") as string;

    await prisma.proveedores.update({
        where:{
            id:id,
        },
        data:{
            companyName:submission.value.companyName,
            companyPhone:submission.value.companyPhone || "",
            companyEmail:submission.value.companyEmail || "",
            contactName: submission.value.contactName,
            contactPhone: submission.value.contactPhone || "",
            contactEmail: submission.value.contactEmail || "",
        }
    })

    await createLog(session.userId as string, `Edito los datos de la Sucursal ${submission.value.companyName}`);

    redirect("/proveedores?action=updated&entity=Proveedor");
}

export async function DeleteProveedor(formData:FormData){

    const session = await getSesion();

    if(session.role !== "admin"){
        redirect("/")
    }

    const id = formData.get("id") as string;

    await prisma.proveedores.update({
        where:{
            id:id,
        },
        data:{
            isDeleted:true,
        }
    })
    await createLog(session.userId as string, `Elimino la Proveedor ${formData.get("name")}`);

    redirect("/proveedores?action=deleted&entity=proveedor");
}
