import { connectMongoDB } from "@/lib/mongo";
import User from "@/models/user";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function POST(req) {

    try {
        let { name, email, username, sname, semail, susername, _id, image, simage, bio, cimage, prevcimage } = await req.json();

        //console.log("Name: ", name);
        //console.log("Email: ", email);
        //console.log("Username: ", username);
        //console.log("Profile Pic: ", image);

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

        if (!bio) {
            bio = "";
        }

        if (!cimage) {
            cimage = prevcimage;
        }

        const updatedPost = await User.findByIdAndUpdate(_id, { name, email, username , image , bio, coverimage: cimage}, { new: true });
        
        return NextResponse.json({updatedPost,
            message: "User has been Updated"
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
        message: "An Error occured while user was being Updated"
        }, { status: 500 });
    }
}