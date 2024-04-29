import { connectMongoDB } from "@/lib/mongo";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const { username, name, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        ////console.log("Name: ", name);
        ////console.log("Email: ", email);
        ////console.log("Password: ", password);

        await connectMongoDB();
        await User.create({ username, name, email, password: hashedPassword });
        
        return NextResponse.json({
            message: "User has been Registered"
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
        message: "An Error occured while user was being Registered"
        }, { status: 500 });
    }
}