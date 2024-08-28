
import { Rekognition } from "@aws-sdk/client-rekognition";

const rekognitionClient = new Rekognition({ region: "eu-west-1" });

async function getSessionResults(sessionId) {
    const response = await rekognitionClient
        .getFaceLivenessSessionResults({
            SessionId: sessionId,
        });

    const confidence = response.Confidence;
    const status = response.Status;
    console.log("Confidence:", confidence);
    console.log("Status:", status);
    try {
        // Convert the object into an array of bytes
        const byteArray = Object.values(response.ReferenceImage.Bytes);
        const buffer = Buffer.from(byteArray);
        const auditImageBase64 = buffer.toString('base64');
        response["ImageBase64"] = "data:image/jpeg;base64,"+auditImageBase64;
    } catch (error) {
        console.error("Error converting image bytes to Base64:", error);
    }


    return response;
}
export async function GET(request) {
    const sessionId = request.nextUrl.searchParams.get("sessionId");
    const response =  await getSessionResults(sessionId);
     
    return Response.json({ data: response });
}
 