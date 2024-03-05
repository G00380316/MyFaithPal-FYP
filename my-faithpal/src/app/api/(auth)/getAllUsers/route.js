import { connectMongoDB } from "@/lib/mongo";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req,res) {
    try {
        await connectMongoDB();

        const user = await User.find();
        
        return NextResponse.json({ user });
    } catch (error){
        console.log(error);
        return NextResponse.json(error);
    }
}