'use client';
import Image from 'next/image'
import Link from 'next/link'
import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import FaceRecognitionModal from '@/app/components/FaceRecognition/FaceRecognitionModal';


const AccountPage = () => {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    setIsMetamaskInstalled(!!window.ethereum);
  }, []);

  async function handleMetamaskLogin() {
    try {
      // Check if Metamask is installed
      if (!isMetamaskInstalled) {
        throw new Error('Metamask is not installed');
      }

      // Request the user's Ethereum address
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      // Authenticate the user on your backend server and retrieve a JWT token
      const response = await fetch('/api/nonce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });
      const jsonResp = await response.json();
      if (!response.ok) {
        const error = jsonResp.message;
        alert(error);
        console.log(error);
        return ;
      }
      const nonce = jsonResp.message;
      const signedMessage = await signer.signMessage(nonce);
      const data = { signedMessage, nonce, address };
      const authResponse = await fetch('/api/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      let token = await authResponse.json();
      setIsModalOpen(true);
      setData({ walletAddress: address , token: token.token });
    } catch (error) {
      console.error(error);
      alert('Failed to login with Metamask');
    }
  }
  return (
    <>
    <FaceRecognitionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        btnText={"Authenticate"}
        data={data}
      />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col  justify-center items-center">
        <div onClick={() => { window.location.href = '/'; }} className="cursor-pointer">
          <Image src={"/logo.png"} alt='Site Logo' width={150} height={150} />
        </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex flex-col">
          <button onClick={()=>{handleMetamaskLogin();}} className=' bg-orange-600 text-white font-bold py-2 px-4 rounded'>
            Login with Metamask
          </button>
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link href="/account/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Register Now
            </Link>
          </p>
        </div>
      </div>

    </>
  )
}

export default AccountPage