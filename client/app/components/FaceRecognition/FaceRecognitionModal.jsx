// FaceRecognitionModal.jsx
import React, { useRef } from 'react';
import Webcam from 'react-webcam';
// import * as AWS from 'aws-sdk';
// import Rekognition from 'aws-sdk/clients/rekognition';
// import S3 from 'aws-sdk/clients/s3';


const FaceRecognitionModal = ({ isOpen, onClose, onVerify, btnText, data }) => {
    const webcamRef = useRef(null);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        // onVerify(imageSrc);
        btnText === "Register" ? registerNewUser(imageSrc) : verifyUser(imageSrc);
    };

    const registerNewUser = async (imageSrc) => {
        console.log(imageSrc);
        
        const response = await fetch('http://localhost:3000/api/faceAuth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageSrc, walletAddress: data.walletAddress })
        });
        if (response.ok) {
            console.log('indexed face');
            window.location.reload();
            onClose(false);

        } else {
            console.log('error came up');
            
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
        if (response.ok) {
            console.log('Face Authenticated');
            localStorage.setItem(data.walletAddress, data.token);
            window.location.href = '/mydrive';
            onClose(false);


        } else {
            console.log('error came up');
            throw new Error('Face not authenticated');
            
            // Handle registration error
        }
    }


    if (!isOpen) return null;



    return (
        <>

            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
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