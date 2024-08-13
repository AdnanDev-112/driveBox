'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react'
import FaceRecognitionModal from '@/app/components/FaceRecognition/FaceRecognitionModal';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userAddress, setUserAddress] = useState(null);
    const [disabled, setDisabled] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setDisabled(true);
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        console.log(response)
        const data = await response.json();
        console.log(data);
        if(!response.ok) return
        alert(data.message);
        setUserAddress(data.walletAddress);
        alert('User registered successfully');
        setIsModalOpen(true);
        // window.location.reload();
    };

    return (
        <>
            <FaceRecognitionModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                btnText={"Register"}
                data={{ walletAddress: userAddress }}
            />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col  justify-center items-center">
                    <div onClick={() => { window.location.href = '/'; }} className="cursor-pointer">
                        <Image src={"/logo.png"} alt='Site Logo' width={150} height={150} />
                    </div>
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Register your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="#" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={disabled}
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already a member?{' '}
                        <Link href="/account/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Login Now
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default RegisterPage
