// FaceRecognitionModal.jsx
import React, { useRef } from 'react';
import Webcam from 'react-webcam';
// import * as AWS from 'aws-sdk';
// import Rekognition from 'aws-sdk/clients/rekognition';
// import S3 from 'aws-sdk/clients/s3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const FaceRecognitionModal = ({ isOpen, onClose, onVerify, btnText, data, setterFunction }) => {
    const webcamRef = useRef(null);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        // onVerify(imageSrc);
        // btnText === "Register" ? registerNewUser(imageSrc) : loginUser(imageSrc);
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
        console.log(imageSrc);

        const response = await fetch('http://localhost:3000/api/faceAuth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageSrc, walletAddress: data.walletAddress, privateKey: data.privateKey })
        });
        if (response.ok) {
            console.log('indexed face');
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

            // Handle registration error
        }
    }

    const loginUser = async (imageSrc) => {
        const response = await fetch('http://localhost:3000/api/faceAuth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageSrc , walletAddress: data.walletAddress})
        });
        if (response.ok) {
            console.log('Face Authenticated');
            localStorage.setItem(data.walletAddress, data.token);
            window.location.href = '/mydrive';
            onClose(false);


        } else {
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

            // Handle registration error
        }
    }
    const verifyUser = async (imageSrc) => {
        const response = await fetch('http://localhost:3000/api/faceAuth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageSrc })
        });
        if (response.status === 200) {
            console.log('Face Authenticated');
            setterFunction(prevMap => {
                const newMap = new Map(prevMap);
                newMap.set(data, false);
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
        }else{
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
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="mb-4"
                    />
                    <button
                        onClick={capture}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full"
                    >
                        {btnText}
                    </button>
                    <button
                        onClick={() => { onClose(false) }}
                        className="bg-red-500 text-white px-4 py-2 rounded-full ml-4"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
};

export default FaceRecognitionModal;