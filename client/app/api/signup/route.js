import { ethers } from 'ethers';
import connectDB from '@/database/utils/connectDB';
import User from '@/database/models/schema';

connectDB();

export async function POST(req = NextApiRequest, res = NextApiResponse) {
	const provider = new ethers.JsonRpcProvider('http://localhost:8545');
	try {
		const { email } = await req.json();

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return new Response('User Already Exists', {
				status: 400,
			})
		}

		// Generate blockchain address and private key
		const wallet = ethers.Wallet.createRandom(provider);
		const blockchainAddress = wallet.address;
		const blockchainPrivateKey = wallet.privateKey;

		// Set initial balance for the new wallet
		const initialBalance = "0x100000000000000000"; // Example balance in hexadecimal (4096 in decimal)
		await provider.send("hardhat_setBalance", [blockchainAddress, initialBalance]);

		// Create new user
		const newUser = new User({ email, blockchainAddress });
		await newUser.save();
		return new Response(JSON.stringify({ message: blockchainPrivateKey, walletAddress: blockchainAddress }), {
			status: 200,
		})
	} catch (error) {
		console.error(error.message);
		return new Response(JSON.stringify({ message: "'An error occurred'" }), {
			status: 500,
		})
	}
}