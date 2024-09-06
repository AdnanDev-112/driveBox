import crypto from 'crypto';
import connectDB from '@/database/utils/connectDB';
import User from '@/database/models/schema';

connectDB();
export  async function POST(req, res) {
    const {address} = await req.json();
    const stringAddress = address.toString();
    try {
        const addressExists = await User.findOne({ blockchainAddress: stringAddress });
        if (!addressExists) {
          return new Response(JSON.stringify({ message: "Please Register First" }), {
            status: 400,
          })
        } 

      const nonce = crypto.randomBytes(32).toString('hex');
      return new Response(JSON.stringify({ message: nonce }), {
        status: 200,
      })
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: 'An error Occured' }), {
        status: 500,
      })
    }
}