
import { Rekognition } from "@aws-sdk/client-rekognition";

const rekognitionClient = new Rekognition({ region: "eu-west-1" });

async function createSession() {
    const response = await rekognitionClient.createFaceLivenessSession();

    const sessionId = response.SessionId;
    return sessionId;
}

export async function GET(request) {
    const sessionId = await createSession();
    return Response.json({ sessionId });
}
 