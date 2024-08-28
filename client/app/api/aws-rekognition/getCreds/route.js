import AWS from 'aws-sdk';

const getCreds = async () => {
    AWS.config.credentials = new AWS.TemporaryCredentials({
        options:{RoleArn: process.env.roleArn}
    });

    await AWS.config.credentials.getPromise();
    const awsCreds = AWS.config.credentials;
    awsCreds['expiration'] = awsCreds.expireTime;
    awsCreds.secretAccessKey = process.env.secretAccessKey;
    return awsCreds;
}

export async function GET(request) {
    const credentialProvider = await getCreds();
    return Response.json({ credentialProvider });
}
