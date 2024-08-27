
// Code to Encrypt  the file :
import { useState } from 'react';
import axios from "axios";

const UploadFileIpfs = ({ contract, account, provider, isFileUploadModalOpen, setFileUploadModalOpen }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [isUploading, setIsUploading] = useState(false);

  // Encryption function using Web Crypto API
  const encryptFile = async (file) => {
    const algorithm = { name: "AES-CBC", length: 256 };
    const key = await crypto.subtle.generateKey(algorithm, true, ["encrypt", "decrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(16)); // Initialization vector

    const fileData = await file.arrayBuffer();
    const encryptedData = await crypto.subtle.encrypt({ ...algorithm, iv }, key, fileData);

    return { encryptedData, key, iv };
  };

  const handleSubmit = async (e) => {
    setIsUploading(true);
    e.preventDefault();
    if (file) {
      try {
        // Encrypt the file before uploading
        const { encryptedData, key, iv } = await encryptFile(file);

        // Convert encrypted data to a Blob
        const encryptedBlob = new Blob([new Uint8Array(encryptedData)], { type: file.type });

        // Create a FormData object and append the encrypted file
        const formData = new FormData();
        formData.append("file", encryptedBlob, fileName);

        // Upload the encrypted file to IPFS
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

        // const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        const fileCid = resFile.data.IpfsHash;

        // Convert the key and iv to hex strings to store them
        const keyHex = Buffer.from(await crypto.subtle.exportKey('raw', key)).toString('hex');
        const ivHex = Buffer.from(iv).toString('hex');

        // Store the CID, key, and IV on the blockchain (this can be encrypted or managed securely)
        await contract.addFile(account,fileName,fileCid.toString(),keyHex.toString(),iv.toString());
        console.log(keyHex,"KeyHex");
        console.log(ivHex,"IVHex");
        

        setFileUploadModalOpen(false); // Close modal on success
        setIsUploading(false);
        window.location.reload();
      } catch (error) {
        console.log(error);
        
        setIsUploading(false);
        alert("Failed to upload image to IPFS");
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("file Name is " , selectedFile.name);
      
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
