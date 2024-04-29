import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mime from "mime-types";
export const dynamic = 'force-dynamic';

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY,
    }
})

async function UploadFiletoS3(file, fileName) {
    
    const fileBuffer = file;

    const fileExtension = fileName.split('.').pop(); // Get the file extension
    const contentType = mime.contentType(fileExtension) || 'application/octet-stream'; // Get the content type

    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
        Key: `imagePosts/${fileName}`,
        Body: fileBuffer,
        ContentType: contentType,
    }//for the key you can put `yourfolder/${fileName} - ${Date.now()}` to upload file to specific folder

    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);

    const fileUrl = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}${fileName}`;

    return {fileName, fileUrl};
}

export async function POST(req) {

    try {

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "File is required." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileDetails = await UploadFiletoS3(buffer, file.name);

        return NextResponse.json({ success: true, fileDetails });

    } catch (error) {

        return NextResponse.json({ error });

    }

    
}
