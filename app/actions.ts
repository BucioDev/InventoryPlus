"use server"
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData, defaultSession } from "./lib";
import { cookies } from "next/headers";
import prisma from "./lib/prisma";
import { parseWithZod } from "@conform-to/zod/v4";
import { categorySchema, loginSchema, orderSchema, productSchema, proveedoresSchema, sucursalSchema, userSchema, userSchemaWithoutPass } from "./lib/zodSchemas";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SubmissionResult } from "@conform-to/react";


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
    session.location = user.location || "",
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

    if(submission.value.location == "null"){
        submission.value.location = ""
    }

    await prisma.user.create({
        data:{
            username:submission.value.username,
            password:hashedPassword,
            firstName:submission.value.firstname,
            lastName:submission.value.lastname || null,
            img:submission.value.img || null,
            role:submission.value.role,
            location:submission.value.location || null,
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
      if(submission.value.location == "null"){
        submission.value.location = ""
    }

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
            location:submission.value.location || null,
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

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
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

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
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

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
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

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
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
            notes:submission.value.notes,
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

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
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
            notes:submission.value.notes,
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

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
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

export async function AddStock(formData: FormData) {

    const session = await getSesion();

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
    }

    const id = formData.get("id") as string;
    const amount = parseInt(formData.get("amount") as string);

    const product = await prisma.product.update({
        where: {
            id: id
        },
        data: {
            stock: {
                increment: amount
            }
        }
    })

    await createLog(session.userId as string, `Agrego mas stock al Producto ${product.name}`);

    redirect("/inventario?action=updated&entity=producto");

} 

export async function TranferStock(formData: FormData){
    
    const session = await getSesion();

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
    }
    const id = formData.get("id") as string;
    const amount = parseInt(formData.get("amount") as string);
    const destinyId = formData.get("destiny") as string;

    //remove stock from origin
    const origin = await prisma.product.update({
        where:{
            id:id
        },
        data:{
            stock:{
                decrement:amount
            }
        }
    })

    //add stock to the destiny
    const destiny = await prisma.product.update({
        where:{
            id:destinyId
        },
        data:{
            stock:{
                increment: amount
            }
        }
    })

    await createLog(session.userId as string, `Tranpaso stock del Producto ${origin.name} desde ${origin.location} a ${destiny.location}`);

    redirect("/inventario?action=updated&entity=producto");
}


//------------------------------------Sucursal Actions -------------------------------------

export async function createSucursal(prevState: unknown, formData:FormData){

    const session = await getSesion();

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
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

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
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

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
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

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
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

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
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

    if (session.role !== "admin" && session.role !== "user") {
    redirect("/");
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


//------------------------------------Order Actions - esta seccion tiene comentarios ya que cada acciones hace multiples mas acciones -------------------------------------

export async function createOrder(prevState: unknown, formData: FormData): Promise<SubmissionResult | void> {

    const session = await getSesion();
  
    if (!session) {
    redirect("/");
    }

  
    const submission = parseWithZod(formData, { schema: orderSchema });
    if (submission.status !== "success")  
        return {
        ...submission,
        error: submission.error ?? undefined,
      };

  const { nickname, status, items } = submission.value;
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.priceAtSale,
    0
  );

  const productIds = items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, buyprice: true},
  });

  //check if that we have enough stock before creatign the order
const stockErrors = [];

for (const item of items) {
  const product = await prisma.product.findUnique({
    where: { id: item.productId },
    select: { stock: true, name:true},
  });

  if (!product) {
    stockErrors.push(`Producto ${item.productId} no encontrado.`);
    continue;
  }

  if (item.quantity > product.stock) {
    stockErrors.push(
      `Cantidad solicitada (${item.quantity}) excede el stock disponible (${product.stock}) para producto ${product.name}.`
    );
  }
}

if (stockErrors.length > 0) {
  redirect("/ordenes?error=Stock insuficiente en uno o más productos")
  return;
}

                        //creating order  and summing the total of all products
  const orderPrice = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    const buyPrice = product?.buyprice || 0;
    return sum + item.quantity * buyPrice;
  }, 0);

  const orderData = {
    nickname:submission.value.nickname,
    status:submission.value.status,
    paymentmethod: submission.value.paymentmethod || null,
    total,
    orderPrice,
    ...(status === "completada" && { sellDate: new Date() }), // Optional sellDate
    items: {
      create: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtSale: item.priceAtSale,
      })),
    },
  };
  const order =  await prisma.order.create({ data: orderData });

  //updating the stock of the products
let updatedProducts: { id: string; stock: number; alertammount: number, name:string }[] = [];

if (order.status === "completada") {
  updatedProducts = await Promise.all(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
        select: {
          id: true,
          stock: true,
          alertammount: true,
          name:true
        },
      })
    )
  );
}

// checking if low stock alert need to be sent
const lowStock = updatedProducts.filter(
  (p) => p.stock <= p.alertammount
);

if (lowStock.length > 0) {
  const productNames = lowStock.map(p => p.name).join(", ");
  //TODO: change this redirect for creting a notificacion that can be seen at any moment, for ease of access
  await createNotification(`Stock bajo en  los productos: ${productNames}`);
}


  await createLog(session.userId as string, `Creo una Orden para ${formData.get("name")}`);

    redirect("/ordenes?action=created&entity=orden");
    return

}


export async function editOrder(prevState: any, formData: FormData) {
   const session = await getSesion();

    if (!session) {
    redirect("/");
    }

    const id = formData.get("id") as string;

  const submission = parseWithZod(formData, { schema: orderSchema });
  if (submission.status !== "success") return submission;

  const { nickname, status, items } = submission.value;
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.priceAtSale,
    0
  );

  const productIds = items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, buyprice: true},
  });

  //check if that we have enough stock before creatign the order
const stockErrors = [];

for (const item of items) {
  const product = await prisma.product.findUnique({
    where: { id: item.productId },
    select: { stock: true, name:true},
  });

  if (!product) {
    stockErrors.push(`Producto ${item.productId} no encontrado.`);
    continue;
  }

  if (item.quantity > product.stock) {
    stockErrors.push(
      `Cantidad solicitada (${item.quantity}) excede el stock disponible (${product.stock}) para producto ${product.name}.`
    );
  }
}

if (stockErrors.length > 0) {
  redirect("/ordenes?error=Stock insuficiente en uno o más productos")
}

                        //updating order  and summing the total of all products
            const orderPrice = items.reduce((sum, item) => {
                const product = products.find((p) => p.id === item.productId);
                const buyPrice = product?.buyprice || 0;
                return sum + item.quantity * buyPrice;
            }, 0);

                   const order = await prisma.order.update({
                    where: { id },
                    data: {
                        nickname,
                        status,
                        paymentmethod: submission.value.paymentmethod || null,
                        total,
                        orderPrice,
                        ...(status === "completada" && { sellDate: new Date() }),
                        
                        items: {
                        deleteMany: {}, // ✅ Deletes all related items for this order
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            priceAtSale: item.priceAtSale,
                        })),
                        },
                    },
                    });

  //updating the stock of the products
let updatedProducts: { id: string; stock: number; alertammount: number, name:string }[] = [];

if (order.status === "completada") {
  updatedProducts = await Promise.all(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
        select: {
          id: true,
          stock: true,
          alertammount: true,
          name:true
        },
      })
    )
  );
}

// checking if low stock alert need to be sent
const lowStock = updatedProducts.filter(
  (p) => p.stock <= p.alertammount
);

if (lowStock.length > 0) {
  const productNames = lowStock.map(p => p.name).join(", ");
  //TODO: change this redirect for creting a notificacion that can be seen at any moment, for ease of access 
   await createNotification(`Stock bajo en los productos: ${productNames}`);
}
    await createLog(session.userId as string, `Actualizo la Orden para ${formData.get("name")}`);

    redirect("/ordenes?action=updated&entity=orden");
}


export async function RefundOrder(formData:FormData){
     const session = await getSesion();

    if (!session) {
    redirect("/");
    }

    const orderId = formData.get("id") as string;

    const order = await prisma.order.findUnique({
        where:{id:orderId},
        select:{
            status:true,
            nickname:true,
            items:{
                select:{
                    productId:true,
                    quantity:true
                }
            }
        }
    })

    if(order?.status !== "completada"){
        redirect("/ordenes?error=La orden no fue completada, no es necesario hacer reembolso")
    }

    await prisma.order.update({
        where:{id:orderId},
        data:{status: "cancelado"}
    })

    await Promise.all(
        order.items.map((item)=>
             prisma.product.update({
                where:{id:item.productId},
                data:{
                    stock:{
                        increment:item.quantity
                    }
                }
            })
        )
    )

    await createLog(session.userId as string, `Reembolso la Orden para ${order.nickname}`);

    redirect("/ordenes?action=updated&entity=orden");

}



//---------------------------------------- Notifications Actiions ------------------------------------------

async function createNotification(message:string){

    await prisma.notifications.create({
        data:{
            message:message
        }
    })
}

export async function MarkAsRead(formData:FormData){

    const id = formData.get("id") as string;
    await prisma.notifications.update({
        where:{
            id:id
        },
        data:{
            read:true
        }
    })
}