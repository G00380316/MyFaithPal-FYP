import { connectMongoDB } from "@/lib/mongo";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        
        const _id = data.recipientId || data.user;

        console.log("ID received by Hook", _id);

        const user = await User.findById({ _id })

        console.log("User has been checked...user: ", user);
        return NextResponse.json({ user });
    } catch (error){
        console.log(error);
        return NextResponse.json(error);
    }
}