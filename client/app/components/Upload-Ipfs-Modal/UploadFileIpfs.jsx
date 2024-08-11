// import {useState} from 'react'
// import axios from "axios";


// const UploadFileIpfs = ({ contract, account, provider }) => {
//     const [file, setFile] = useState(null);
//     const [fileName, setFileName] = useState("No image selected");
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       if (file) {
//         try {
//           const formData = new FormData();
//           formData.append("file", file);
//           const resFile = await axios({
//             method: "post",
//             url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//             data: formData,
//             headers: {
//               pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API,
//               pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
//               "Content-Type": "multipart/form-data",
//             },
//           });
//           const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
//           await contract.add(account,ImgHash);
//           console.log(ImgHash);
//           alert("Successfully Image Uploaded");
//           setFileName("No image selected");
//           setFile(null);
//         } catch (e) {
//           alert("Unable to upload image to Pinata");
//         }
//       }
//       setFileName("No image selected");
//       setFile(null);
//     };
//     const retrieveFile = (e) => {
//       const data = e.target.files[0]; //files array of files object
//       // console.log(data);
//       const reader = new window.FileReader();
//       reader.readAsArrayBuffer(data);
//       reader.onloadend = () => {
//         setFile(e.target.files[0]);
//       };
//       setFileName(e.target.files[0].name);
//       e.preventDefault();
//     };
//     return (
//       <div className="top ">
//         <form className="form flex-col" onSubmit={handleSubmit}>
//           <label htmlFor="file-upload" className="choose">
//             Choose Image
//           </label>
//           <input
//             disabled={!account}
//             type="file"
//             id="file-upload"
//             name="data"
//             onChange={retrieveFile}
//           />
//           <span className="textArea">Image: {fileName}</span>
//           <button type="submit" className="upload bg-red-600" disabled={!file}>
//             Upload File
//           </button>
//         </form>
//       </div>
//     );
// }

// export default UploadFileIpfs ;

import { useState } from 'react';
import axios from "axios";

const UploadFileIpfs = ({ contract, account, provider, isFileUploadModalOpen, setFileUploadModalOpen }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    setIsUploading(true);
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        await contract.addFile(account, ImgHash);
        // await contract.addFile( ImgHash);

        setFileUploadModalOpen(false); // Close modal on success
        setIsUploading(false);
        window.location.reload();


      } catch (error) {
        setIsUploading(false);

        alert("Failed to upload image to IPFS");
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <>
      {isFileUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Upload to IPFS</h2>
            <form onSubmit={handleSubmit}>
              <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none" />
              <div className="mt-4 flex justify-end">
                <button disabled={isUploading} type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-150 ease-in-out mr-2">
                  Upload
                </button>
                <button disabled={isUploading} type="button" onClick={() => setFileUploadModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition duration-150 ease-in-out">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadFileIpfs;