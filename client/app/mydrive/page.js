'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Image from 'next/image';
import Upload from "../components/artifacts/contracts/UploadFile.sol/UploadFile.json";
import UserNavbar from '../components/User-Navbar/UserNavbar';
import UploadFileIpfs from '../components/Upload-Ipfs-Modal/UploadFileIpfs';
import ShareFileModal from '../components/ShareFileModal/ShareFileModal'; 
import ProtectedComponent from '@/utilities/protectedComponent';
import { DocumentTextIcon, FolderOpenIcon, MagnifyingGlassIcon, TrashIcon, ShareIcon, LockClosedIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'; 
import FaceRecognitionModal from '../components/FaceRecognition/FaceRecognitionModal';

const MyDriveHomePage = () => {

    // State to manage dropdown visibility
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Function to toggle dropdown menu
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    // Contract and its Code
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [data, setData] = useState([]);

    // Track Active Component
    const [activeComponent, setActiveComponent] = useState(0);
    // Function to reset states
    const resetStates = () => {
        setData([]);
        setFileEncryptionData(new Map());
        setFileDecryptedData(new Map());
        setFileCIDDataMap(new Map());
        setDataLock(new Map());
    };
    const handleComponentSwitch = (number) => {
        resetStates();
        setActiveComponent(number);
        if (number == 0) {
            getdata(contract, account);
        } else {
            getSharedData(contract, account);
        }


    }

    // Upload File Modal 
    const [isFileUploadModalOpen, setFileUploadModalOpen] = useState(false);

    // Share Modal
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);

    // Lock
    const [dataLock, setDataLock] = useState(new Map());
    const [isFaceAuthModalOpen, setIsFaceAuthModalOpen] = useState(false);
    const [lockedFileUrl, setLockedFileUrl] = useState(null);
    const [fileEncryptionData, setFileEncryptionData] = useState(new Map());
    const [fileDecryptedData, setFileDecryptedData] = useState(new Map());
    const [fileCIDDataMap, setFileCIDDataMap] = useState(new Map());


    // Search Functionality 
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Ensure `ethereum` is available in the window object
        if (window.ethereum !== null) {
            const provider = new ethers.BrowserProvider(window.ethereum);

            // Functions
            const loadProvider = async () => {
                // Listen for chain and account changes
                window.ethereum.on("chainChanged", () => window.location.reload());
                window.ethereum.on("accountsChanged", () => window.location.reload());

                // Request accounts
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();

                const address = await signer.getAddress();
                setAccount(address);
                const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
                const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
                getdata(contract, address);
                setContract(contract);
                setProvider(provider);
            };

            loadProvider().catch(console.error);
        }

    }, []);

    const getdata = async (contract, account) => {
        let dataArray;
        try {
            dataArray = await contract.getMyFiles(account);
        } catch (e) {
            console.log(e.message);
        }
        const isEmpty = dataArray ? Object.keys(dataArray).length === 0 : true;
        if (!isEmpty) {
            let tempArray = Object.values(dataArray);
            const finalDataArray = [];

            const lockMap = new Map();
            const dataEncyrptionMap = new Map();
            const dataDecyrptionMap = new Map();
            const fileData = new Map();

            tempArray.forEach(item => {
                const itemStructure = {
                    fileName: item[0],
                    fileCID: item[1],
                    fileHex: item[2],
                    fileIV: item[3]
                }
                fileData.set(itemStructure.fileCID, { ...itemStructure });
                lockMap.set(itemStructure.fileHex, true);
                dataEncyrptionMap.set(itemStructure.fileHex, { fileIV: itemStructure.fileIV, fileCID: itemStructure.fileCID });
                finalDataArray.push(itemStructure);
                dataDecyrptionMap.set(itemStructure.fileHex, false);
            });
            setFileEncryptionData(dataEncyrptionMap);
            setData(finalDataArray);
            setFileDecryptedData(dataDecyrptionMap);
            setFileCIDDataMap(fileData);
            setDataLock(lockMap);
        } else {
            console.log("No image to display");
        }
    };
    const getSharedData = async (contract, account) => {
        let dataArray;
        try {
            dataArray = await contract.sharedWithMe(account);
        } catch (e) {
            console.log(e.message);
        }

        const isEmpty = dataArray ? Object.keys(dataArray).length === 0 : true;

        if (!isEmpty) {
            let tempArray = Object.values(dataArray);
            const finalDataArray = [];

            const lockMap = new Map();
            const dataEncyrptionMap = new Map();
            const dataDecyrptionMap = new Map();
            const fileData = new Map();

            tempArray.forEach(item => {
                const itemStructure = {
                    fileName: item[0],
                    fileCID: item[1],
                    fileHex: item[2],
                    fileIV: item[3]
                }
                fileData.set(itemStructure.fileCID, { ...itemStructure });
                lockMap.set(itemStructure.fileHex, true);
                dataEncyrptionMap.set(itemStructure.fileHex, { fileIV: itemStructure.fileIV, fileCID: itemStructure.fileCID });
                finalDataArray.push(itemStructure);
                dataDecyrptionMap.set(itemStructure.fileHex, false);
            });

            setFileEncryptionData(dataEncyrptionMap);
            setData(finalDataArray);
            setFileDecryptedData(dataDecyrptionMap);
            setFileCIDDataMap(fileData);
            setDataLock(lockMap);
        } else {
            setData([]);
            console.log("No Items Shared with this User");
        }
    };


    const handleTrashClick = async (cid) => {
        try {
            const removeFromIpfs = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
                headers: {
                    pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API,
                    pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
                }
            });
            const tx = await contract.removeFile(account, cid);
            await tx.wait();
            window.location.reload();
        } catch (error) {
            console.error('Error removing URL:', error);
        }
    };

    const handleShareClick = (file) => {
        setCurrentFile(file);
        setShareModalOpen(true);
    };

    const handleFileUnlock = (fileUrl) => {
        setLockedFileUrl(fileUrl);
        setIsFaceAuthModalOpen(true);
    }

    const handleFileDownload = async (fileCID, fileName) => {
        try {
            const encryptionKeyHex = fileCIDDataMap.get(fileCID).fileHex;
            const ivHex = fileCIDDataMap.get(fileCID).fileIV;
            // Step 1: Fetch the encrypted file from IPFS
            const pinataFileURL = "https://gateway.pinata.cloud/ipfs/" + fileCID;
            const response = await fetch(pinataFileURL);
            const encryptedData = await response.arrayBuffer();

            // Step 2: Convert the encryption key and IV from hex to Uint8Array
            const key = Buffer.from(encryptionKeyHex, 'hex');
            const ivArray = ivHex.split(',').map(num => parseInt(num, 10));
            const iv = new Uint8Array(ivArray);

            // Step 3: Decrypt the file
            const algorithm = { name: "AES-CBC", iv };
            const cryptoKey = await crypto.subtle.importKey("raw", key, algorithm, false, ["decrypt"]);
            const decryptedData = await crypto.subtle.decrypt(algorithm, cryptoKey, encryptedData);

            // Step 4: Create a Blob from the decrypted data
            const blob = new Blob([decryptedData]);

            // Step 5: Create a download link for the decrypted file
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // Cleanup: Remove the link from the document
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("File download and decryption failed:", error);
        }
    };


    return (
        <>
            <FaceRecognitionModal
                isOpen={isFaceAuthModalOpen}
                onClose={() => setIsFaceAuthModalOpen(false)}
                btnText={"Verify"}
                data={{ lockedFileUrl, walletAddress: account }}
                additionalData={fileEncryptionData.get(lockedFileUrl)}
                setterFunction={setDataLock}
                additionalSetterFunction={setFileDecryptedData}
            />
            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <div className="w-64 bg-white text-gray-700 border-r">
                    <div className="p-5 border-b">
                        <Image src={"/logo.png"} alt='Site Logo' width={150} height={150} />
                    </div>
                    <div className="px-5 py-3 w-full">
                        <button onClick={() => { setFileUploadModalOpen(true) }} className="bg-green-500 text-white px-4 py-2 rounded-lg h-full w-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700">
                            Upload
                        </button>
                    </div>
                    <ul>
                        <li className={"flex items-center p-3 hover:bg-gray-200 cursor-pointer" + (activeComponent == 0 ? " bg-gray-300" : "")} onClick={() => handleComponentSwitch(0)}>
                            <FolderOpenIcon className="h-5 w-5 mr-2" /> My Drive
                        </li>
                        <li className={"flex items-center p-3 hover:bg-gray-200 cursor-pointer" + (activeComponent == 1 ? " bg-gray-300" : "")} onClick={() => handleComponentSwitch(1)}>
                            <DocumentTextIcon className="h-5 w-5 mr-2" /> Shared with me
                        </li>
                    </ul>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Top Bar */}
                    <div className="p-5 bg-white shadow-sm flex items-center">
                        <div className="flex bg-gray-200 p-2 rounded-lg flex-1">
                            <MagnifyingGlassIcon className="h-9 w-9 text-gray-500" />
                            {/* <input type="search" placeholder="Search in Drive" className="bg-transparent p-2 w-full focus:outline-none" /> */}
                            <input
                                type="search"
                                placeholder="Search in Drive"
                                className="bg-transparent p-2 w-full focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                            />

                        </div>
                        <div className="ml-5" onClick={toggleDropdown}>
                            <Image src={"/user.png"} width={50} alt='User Icon' height={50} className='cursor-pointer' />
                            {isDropdownOpen && <UserNavbar userAddress={account} />}
                        </div>
                    </div>

                    {/* Files and Folders */}
                    <div className="flex-1 p-5 overflow-auto">
                        <div className="grid grid-cols-4 gap-4">
                            {data.length > 0 && activeComponent == 0 ?
                                data.filter(item => item.fileName.toLowerCase().includes(searchQuery))
                                    .map((item, index) => (
                                        <div className="bg-white p-5 shadow rounded-lg flex flex-col items-center relative" key={index}>
                                            <div className="relative w-full" style={{ paddingBottom: '75%' }}> {/* 4:3 Aspect Ratio */}
                                                {!dataLock.get(item.fileHex) && <Image objectFit="cover" layout="fill" src={fileDecryptedData.get(item.fileHex)} alt='File' className={`absolute inset-0 ${dataLock.get(item.fileHex) ? 'filter blur-lg' : ''}`} />}
                                                {dataLock.get(item.fileHex) && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                        <LockClosedIcon
                                                            className='h-10 w-10 text-white cursor-pointer'
                                                            onClick={() => handleFileUnlock(item.fileHex)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p>{item.fileName}</p>
                                            </div>
                                            {dataLock.get(item.fileHex) != true ? (
                                                <>
                                                    <div className="mt-2 w-full flex justify-between">
                                                        <div className='flex-1 flex justify-center'>
                                                            <ShareIcon className='h-10 w-10 text-blue-400 cursor-pointer' onClick={() => handleShareClick(item)} />
                                                        </div>
                                                        <div className='flex-1 flex justify-center'>
                                                            <ArrowDownTrayIcon className='h-10 w-10 text-blue-400 cursor-pointer' onClick={() => handleFileDownload(item.fileCID, item.fileName)} />
                                                        </div>
                                                        <div className='flex-1 flex justify-center'>
                                                            <TrashIcon className='h-10 w-10 text-red-400 cursor-pointer' onClick={() => handleTrashClick(item.fileCID)} />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (<></>)}


                                        </div>
                                    )) : (activeComponent == 0 && data.length == 0) && <div className="text-center text-2xl text-gray-500">No files found</div>}
                            {data.length > 0 && activeComponent == 1 ? 
                            data.filter(item => item.fileName.toLowerCase().includes(searchQuery))
                            .map((item, index) => (
                                <div className="bg-white p-5 shadow rounded-lg flex flex-col items-center relative" key={index}>
                                    {/* <Image src={item} width={200} height={200} alt='File' className="mt-2" /> */}
                                    <div className="relative w-full" style={{ paddingBottom: '75%' }}> {/* 4:3 Aspect Ratio */}
                                        {!dataLock.get(item.fileHex) && <Image objectFit="cover" layout="fill" src={fileDecryptedData.get(item.fileHex)} alt='File' className={`absolute inset-0 ${dataLock.get(item.fileHex) ? 'filter blur-lg' : ''}`} />}
                                        {dataLock.get(item.fileHex) && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                <LockClosedIcon
                                                    className='h-10 w-10 text-white cursor-pointer'
                                                    onClick={() => handleFileUnlock(item.fileHex)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p>{item.fileName}</p>
                                    </div>
                                </div>
                            )) : (activeComponent == 1 && data.length == 0) && <div className="text-center text-2xl text-gray-500">No files found</div>}
                        </div>
                    </div>
                </div>
                <UploadFileIpfs contract={contract} account={account} provider={provider} isFileUploadModalOpen={isFileUploadModalOpen} setFileUploadModalOpen={setFileUploadModalOpen} />
                <ShareFileModal
                    isOpen={isShareModalOpen}
                    onClose={() => setShareModalOpen(false)}
                    fileData={currentFile && currentFile}
                    contract={contract}
                    ownerAddress={account}
                />
            </div>
        </>

    );
};

export default ProtectedComponent(MyDriveHomePage);
