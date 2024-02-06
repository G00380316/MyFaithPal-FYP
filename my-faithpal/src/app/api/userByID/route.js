import { connectMongoDB } from "@/lib/mongo";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { _id } = await req.json();

        const user = await User.findOne({ _id })

        console.log("User has been checked...user: ", user);
        return NextResponse.json({ user });
    } catch (error){
        console.log(error);
        return NextResponse.json(error);
    }
}