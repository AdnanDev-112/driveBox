import jwt from 'jsonwebtoken';
import { verifyMessage } from 'ethers';

const secretKey = "TEST";

export  async function POST(req,res){
    const { signedMessage, nonce, address } = await req.json();
    const recoveredAddress =  verifyMessage(nonce, signedMessage);
    if (recoveredAddress !== address) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
      })
    }
    // Generate the JWT token
    const token = jwt.sign({ address }, secretKey, { expiresIn: '1h' });
    // Send the JWT token to the frontend
    return new Response(JSON.stringify({ token }), {
      status: 200,
    })
}