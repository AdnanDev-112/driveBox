import React, {useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FaceLivenessChecker from './FaceLivenessChecker/FaceLivenessChecker';

// Function to Decrypt the Encrypted Data
const decryptFile = async (cid, encryptionKeyHex, ivHex) => {
    try {
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
        const encryptedData = await response.arrayBuffer();
        const key = Buffer.from(encryptionKeyHex, 'hex');
        const ivArray = ivHex.split(',').map(num => parseInt(num, 10));
        const ivUint8Array = new Uint8Array(ivArray);
        const iv = ivUint8Array;

        const algorithm = { name: "AES-CBC", iv };
        const cryptoKey = await crypto.subtle.importKey("raw", key, algorithm, false, ["decrypt"]);

        const decryptedData = await crypto.subtle.decrypt(algorithm, cryptoKey, encryptedData);

        const blob = new Blob([decryptedData], { type: 'image/png' });
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};


const FaceRecognitionModal = ({ isOpen, onClose, onVerify, btnText, data, additionalData, setterFunction, additionalSetterFunction }) => {
    const [btnDisabled, setBtnDisabled] = useState(false);

    const afterLivenessChecker = (imageSrc) => {
        switch (btnText) {
            case "Register":
                registerNewUser(imageSrc);
                break;
            case "Authenticate":
                loginUser(imageSrc);
                break;
            case "Verify":
                verifyUser(imageSrc);
                break;

            default:
                break;
        }
    };
    const registerNewUser = async (imageSrc) => {
        setBtnDisabled(true);
        const response = await fetch('http://localhost:3000/api/faceAuth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageSrc, walletAddress: data.walletAddress, privateKey: data.privateKey })
        });
        setBtnDisabled(false);
        if (response.ok) {
            alert('User registered successfully');
            window.location.reload();
            onClose(false);

        } else {
            toast.error('Access Denied', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",

            });

        }
    }

    const loginUser = async (imageSrc) => {
        setBtnDisabled(true);
        const response = await fetch('http://localhost:3000/api/faceAuth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageSrc, walletAddress: data.walletAddress })
        });
        setBtnDisabled(false);
        if (response.status === 200) {
            localStorage.setItem(data.walletAddress, data.token);
            localStorage.setItem("walletaddress", data.walletAddress);

            window.location.href = '/mydrive';
            onClose(false);


        } else if (response.status === 401) {
            toast.error('  Access Denied!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",

            });
        }
        else {
            toast.error('No Face Detected', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",

            });
            setTimeout(() => {
                onClose(false);
            }, 2000);
        }
    }
    const verifyUser = async (imageSrc) => {
        setBtnDisabled(true);
        const response = await fetch('http://localhost:3000/api/faceAuth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageSrc, walletAddress: data.walletAddress })
        });
        setBtnDisabled(false);
        if (response.status === 200) {
            const decryptedFileData = await decryptFile(additionalData.fileCID, data.lockedFileUrl, additionalData.fileIV);
            setterFunction(prevMap => {
                const newMap = new Map(prevMap);
                newMap.set(data.lockedFileUrl, false);
                return newMap;
            });
            additionalSetterFunction(prevMap => {
                const newMap = new Map(prevMap);
                newMap.set(data.lockedFileUrl, decryptedFileData);
                return newMap;
            });
            toast.success('Access Granted', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",

            });
            setTimeout(() => {
                onClose(false);
            }, 2000);



        } else if (response.status === 401) {
            toast.error('Access Denied', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",

            });
            setTimeout(() => {
                onClose(false);
            }, 2000);
        } else {
            toast.error('No Face Detected', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",

            });
            setTimeout(() => {
                onClose(false);
            }, 2000);
        }
    }
    if (!isOpen) return null;
    return (
        <>
            <ToastContainer />
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl mb-4">Face Recognition</h2>
                    <FaceLivenessChecker afterLivenessChecker={afterLivenessChecker} />
                    {!btnDisabled && <>
                        <button
                            onClick={() => { onClose(false) }}
                            className="bg-red-500 text-white px-4 py-2 rounded-full ml-4"
                        >
                            Close
                        </button>
                    </>}
                </div>
            </div>
        </>
    );
};

export default FaceRecognitionModal;