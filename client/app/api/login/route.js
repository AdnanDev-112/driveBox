// import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import { verifyMessage } from 'ethers';

// const secretKey = process.env.secretKey;
const secretKey = "TEST";



export  async function POST(req,res){
    const { signedMessage, nonce, address } = await req.json();
    // Ensure ethers is correctly imported and verifyMessage is available
    // if (!ethers || !ethers.utils || !ethers.utils.verifyMessage) {
    //   throw new Error('ethers library is not properly imported or verifyMessage is not available');
    // }
    const recoveredAddress =  verifyMessage(nonce, signedMessage);
    console.log(recoveredAddress ,"Recovered Address is here");
    if (recoveredAddress !== address) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
      })
    }
  
    // Generate the JWT token
    const token = jwt.sign({ address }, secretKey, { expiresIn: '25s' });
  
    // Send the JWT token to the frontend
    return new Response(JSON.stringify({ token }), {
      status: 200,
    })
}