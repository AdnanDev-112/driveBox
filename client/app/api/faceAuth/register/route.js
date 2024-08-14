// import { ethers } from 'ethers';
import connectDB from '@/database/utils/connectDB';
import User from '@/database/models/schema';

import * as AWS from 'aws-sdk';
import Rekognition from 'aws-sdk/clients/rekognition';
import S3 from 'aws-sdk/clients/s3';

connectDB();


//   AWS Configs 
if (process.env.NEXT_PUBLIC_PB_ACCESS_KEY_ID) {
    AWS.config.update({
        accessKeyId: process.env.NEXT_PUBLIC_PB_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_PB_SECRET_ACCESS_KEY,
        region: process.env.NEXT_PUBLIC_PB_REGION,
    });
}

const rekog = new Rekognition();
const s3 = new S3();
const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
const indexFace = async (image) => {
    if(image === undefined) return;
    try {
        const base64Img = image.replace('data:image/jpeg;base64,', '');
        const imgBuffer = Buffer.from(base64Img, 'base64');
        // create a unique id for the image
        const imageId = uuid();
        // Add face to rekognition collection
       const newIndexedFace =  await rekog
            .indexFaces({
                CollectionId: 'compare-face-dev',
                ExternalImageId: imageId,
                Image: {
                    Bytes: imgBuffer,
                },
            })
            .promise();
        console.log(JSON.stringify(newIndexedFace, null, 2));
    } catch (e) {
        console.error(e);
    }
}

export async function POST(req, res) {
    const { walletAddress, imageSrc } = await req.json();
    try {
        await indexFace(imageSrc);

        // Check if user already exists
        const existingUser = await User.findOne({ blockchainAddress: walletAddress });
        if (!existingUser) {
            // return res.status(400).json({ message: 'User already exists' });
            return new Response('No User Exists', {
                status: 400,
            })
        };
        // Update the existingUser property in MongoDB
        existingUser.faceAuth = true;
        await existingUser.save();

        // Return the updated user
        return new Response('User Updated Successfully', {
            status: 200,
        })

    } catch (error) {
        console.error(error.message);
        return new Response(JSON.stringify({ message: "'An error occurred'" }), {
            status: 500,
        })

    }





}