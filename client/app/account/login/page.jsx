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
      console.log(address);
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
      console.log(nonce);

      const signedMessage = await signer.signMessage(nonce);
      const data = { signedMessage, nonce, address };
      console.log(data, "Data is here");
      const authResponse = await fetch('/api/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      let token = await authResponse.json();
      console.log(token);

      //const { token } = await response.json();
      setIsModalOpen(true);
      setData({ walletAddress: address , token: token.token });

      // Store the JWT token in local storage
      // localStorage.setItem(address, token.token);

      // Redirect the user to the protected route
      // window.location.href = '/mydrive';
    } catch (error) {
      console.error(error);
      alert('Failed to login with Metamask');
    }
  }

  const handleVerify = async (imageSrc) => {
    // Send the screenshot to the verification API
    // const response = await fetch('/api/verify', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ image: imageSrc, address })
    // });
    console.log(imageSrc);
    

    // const result = await response.json();
    // if (result.success) {
    //   // Redirect the user to the protected route
    //   window.location.href = '/mydrive';
    // } else {
    //   alert('Verification failed. Access denied.');
    // }
  };
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
          {/* <form action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link href="/account/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Register Now
            </Link>
          </p>
          */}
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