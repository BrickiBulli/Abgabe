import { NextResponse } from "next/server";
import { db } from "@/lib/db"
import bcrypt from "bcrypt";

const pepper = process.env.PEPPER_SECRET || "";

async function generateSalt(): Promise<string> {
    return await bcrypt.genSalt(10); 
}

async function hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password + pepper, salt); 
}

export async function POST(req: Request){
    try{
        const body = await req.json();

        const { user: { email, username, password } } = body;

        const exisitingUserByEmail = await db.user.findUnique({
            where: {email: email}
        })

        if(exisitingUserByEmail){
            return NextResponse.json({user: null, message: "There was a error on signup please try again"}, {status: 409})
        }


        const exisitingUserByUsername = await db.user.findUnique({
            where: {username: username}
        })

        if(exisitingUserByUsername){
            return NextResponse.json({user: null, message: "There was a error on signup please try again"}, {status: 409})
        }

        const salt = await generateSalt();
        const hashedPassword = await hashPassword(password, salt);

        const newUser = await db.user.create({
            data:{
                username,
                email,
                role: 1,
                password_hash: hashedPassword,
                password_salt: salt
            }
        })

        return NextResponse.json({user: newUser, message: "User created succesfully"}, {status:201});
    }catch(error){
        return NextResponse.json({message:"User created unsuccesfully"}, {status:500});

    }
}