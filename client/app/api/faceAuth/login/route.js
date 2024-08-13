
import * as AWS from 'aws-sdk';
import Rekognition from 'aws-sdk/clients/rekognition';
import S3 from 'aws-sdk/clients/s3';


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

  const images = [];
  console.log(res.FaceMatches, "Face Matches");

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
  const { imageSrc } = await req.json();

  const faces = await faceAuthLogin(imageSrc);
  if(faces.length > 0) {
    return new Response(JSON.stringify({ message: 'Face Authenticated' }), {
      status: 200,
    })
  }else {
    return new Response(JSON.stringify({ message: 'Face Not Authenticated' }), {
      status: 401,
    })
  }
}