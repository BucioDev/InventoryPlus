import { SessionOptions } from "iron-session";

export interface SessionData {
    userId?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    img?: string;
    role?: string;
    location?:String;
    isLoggedIn: boolean;
    shiftOpen: boolean;
    activeshift?: string;
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
    shiftOpen:false,
}

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_KEY!,
    cookieName:"session",
    cookieOptions:{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
         // 👇 Cookie lifetime in seconds
        maxAge: 60 * 60 * 18 * 1, // 18 hrs
    }
}