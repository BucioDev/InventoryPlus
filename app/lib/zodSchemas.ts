import z from "zod";


export const userSchema = z.object({
    username: z.string().min(3,"Nombre de usuario  debe ser mayor a 3").max(20, "Nombre de usuario debe ser menor a 20"),
    password: z.string().min(8,"Contraseña debe ser mayor a 8 caracteres").max(20, "Contraseña debe ser menor a 20"),
    firstname: z.string().min(3,"Nombre es Requerido y debe ser mayor a 3 caracteres"),
    lastname: z.string().min(3).optional(),
    img: z.string().optional(),
    role: z.enum(["admin","vendor","user"],"Debe asignar un rol"),
})
export const userSchemaWithoutPass = z.object({
    username: z.string().min(3,"Nombre de usuario  debe ser mayor a 3").max(20, "Nombre de usuario debe ser menor a 20"),
    firstname: z.string().min(3,"Nombre es Requerido y debe ser mayor a 3 caracteres"),
    lastname: z.string().min(3).optional(),
    img: z.string().optional(),
    role: z.enum(["admin","vendor","user"],"Debe asignar un rol"),
})

export const loginSchema = z.object({
    username: z.string().min(1,"Ususario incorrecto"),
    password: z.string().min(1,"Contraseña incorrecta"),
})

export const categorySchema = z.object({
    name: z.string().min(4,"Nombre de la categoria es requerido"),
    description: z.string().optional(),
})

export const productSchema = z.object({
    name: z.string("Nombre del producto es requerido").min(4,"Nombre del producto es requerido"),
    barcode: z.string("Codigo de barras es requerido").min(1,"Codigo de barras es requerido"),
    categoryId: z.string("Categoria es requerida").min(1,"Categoria es requerida"),
    compatibility: z.array(z.string("Compatibilidad es requerida")).min(1,"Compatibilidad es requerida"),
    images: z.array(z.string("Imagenes es requerida")).min(1,"Imagenes es requerida"),
    brand: z.string("Marca es requerida").min(4,"Marca es requerida"),
    location: z.string("Ubicacion es requerida").min(4,"Ubicacion es requerida"),
    variant: z.string().optional(),
    stock: z.number("Cantidad es requerida"),
    sellprice: z.number("Precio de venta es requerido"),
    buyprice: z.number("Precio de compra es requerido"),
})