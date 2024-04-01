import { connectMongoDB } from "@/lib/mongo";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {

    try {
        var { name, email, username, sname, semail, susername, _id, image, simage } = await req.json();

        console.log("Name: ", name);
        console.log("Email: ", email);
        console.log("Username: ", username);
        console.log("Profile Pic: ", image);

        await connectMongoDB();

        if (!name) {
            name = sname;
        }

        if (!email) {
            email = semail;
        }

        if (!username) {
            username = susername;
        }

        if (!image) {
            image = simage;
        }

        const updatedPost = await User.findByIdAndUpdate(_id, { name, email, username , image}, { new: true });
        
        return NextResponse.json({updatedPost,
            message: "User has been Updated"
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
        message: "An Error occured while user was being Updated"
        }, { status: 500 });
    }
}