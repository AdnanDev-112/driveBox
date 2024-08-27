
import * as AWS from 'aws-sdk';
import Rekognition from 'aws-sdk/clients/rekognition';
import S3 from 'aws-sdk/clients/s3';
import { ethers } from 'ethers';
import Upload from "../../../components/artifacts/contracts/UploadFile.sol/UploadFile.json";




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


const faceAuthLogin = async (image) => {
  const base64Img = image.replace('data:image/jpeg;base64,', '');
  const imgBuffer = Buffer.from(base64Img, 'base64');
  const res = await rekog
    .searchFacesByImage({
      CollectionId: 'compare-face-dev',
      Image: {
        Bytes: imgBuffer,
      },
    })
    .promise();

  // const images = [];
  // loop faces
  // for (const face of res.FaceMatches ?? []) {
  //   // get the image from s3
  //   const s3Res = await s3
  //     .getObject({
  //       Bucket: 'compare-face-dev',
  //       Key: 'faces/' + face.Face?.ExternalImageId + '.jpg',
  //     })
  //     .promise();
  //   // convert to base64
  //   const base64 = s3Res.Body?.toString('base64');
  //   images.push(base64);
  // }
  return res.FaceMatches;

};

export async function POST(req, res) {
  const { imageSrc ,walletAddress } = await req.json();
  try {
    const faces = await faceAuthLogin(imageSrc);
    console.log(faces, "Faces");
    const faceID = faces[0].Face.FaceId;

    // Blockchain Logic :

    // Connect to a public Ethereum node
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");

    // Contract details
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contractABI = Upload.abi;

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Call a read-only function
    const decision = await contract.verifyFaceAuth(walletAddress ,faceID );
    
    if (decision) {
      return new Response(JSON.stringify({ message: 'Face Authenticated' }), {
        status: 200,
      })
    } else {
      return new Response(JSON.stringify({ message: 'Face Not Authenticated' }), {
        status: 401,
      })
    }
  } catch (error) {
    console.log("No Face Detected");
    console.log(error);
    return new Response(JSON.stringify({ message: 'No Face Detected' }), {
      status: 400,
    })


  }


}