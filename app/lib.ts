import { SessionOptions } from "iron-session";

export interface SessionData {
    userId?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    img?: string;
    role?: string;
    isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
}

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_KEY!,
    cookieName:"session",
    cookieOptions:{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
    }
}