// 'use client';
// import { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import Image from 'next/image';
// import { DocumentTextIcon, FolderOpenIcon, MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline'; // For DocumentTextIcon
// import Upload from "../components/artifacts/contracts/UploadFile.sol/UploadFile.json";
// import UserNavbar from '../components/User-Navbar/UserNavbar';
// import UploadFileIpfs from '../components/Upload-Ipfs-Modal/UploadFileIpfs';
// import axios from 'axios';

// const MyDriveHomePage = () => {
//     // State to manage dropdown visibility
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//     // Function to toggle dropdown menu
//     const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

//     // Contract and its Code
//     const [account, setAccount] = useState("");
//     const [contract, setContract] = useState(null);
//     const [provider, setProvider] = useState(null);
//     // const [modalOpen, setModalOpen] = useState(false);
//     const [data, setData] = useState([]);

//     // Upload File Modal 
//     const [isFileUploadModalOpen, setFileUploadModalOpen] = useState(false);



//     useEffect(() => {
//         // Ensure `ethereum` is available in the window object
//         if (window.ethereum !== null) {
//             const provider = new ethers.BrowserProvider(window.ethereum);

//             // Functions
//             const loadProvider = async () => {
//                 // Listen for chain and account changes
//                 window.ethereum.on("chainChanged", () => window.location.reload());
//                 window.ethereum.on("accountsChanged", () => window.location.reload());

//                 // Request accounts
//                 await provider.send("eth_requestAccounts", []);
//                 const signer = await provider.getSigner();

//                 const address = await signer.getAddress();
//                 console.log(address);
//                 setAccount(address);

//                 const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//                 const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
//                 console.log(contract, address);
//                 getdata(contract, address);
//                 setContract(contract);
//                 setProvider(provider);
//             };

//             loadProvider().catch(console.error);
//         }

//     }, []);


//     const getdata = async (contract, account) => {
//         let dataArray;
//         //   const Otheraddress = document.querySelector(".address").value;
//         try {
//             // if (Otheraddress) {
//             //   dataArray = await contract.display(Otheraddress);
//             //   console.log(dataArray);
//             // } else {
//             console.log(account);
//             dataArray = await contract.displayFiles(account);
//             console.log(dataArray);
//             // }
//         } catch (e) {
//             console.log(e.message);
//         }
//         const isEmpty = dataArray ? Object.keys(dataArray).length === 0: true;

//         if (!isEmpty) {

//             //   const str = dataArray.toString();
//             //   const str_array = str.split(",");
//             //   const images = str_array.map((item, i) => {
//             //     return (
//             //       <a href={item} key={i} target="_blank">
//             //         <Image
//             //         width={200}
//             //         height={200}
//             //           key={i}
//             //         //   src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
//             //         src={item}
//             //           alt="new"
//             //           className="image-list"
//             //         />
//             //       </a>
//             //     );
//             //   });
//             //   setData(images);
//             setData(Object.values(dataArray));
//             console.log(Object.values(dataArray));
//         } else {
//             setData(Object.values(dataArray));
//             console.log("No image to display");
//         }
//     };

//     const handleTrashClick = async (url) => {
//         const parts = url.split('/');
//         const cid = parts[parts.length - 1];  // Outputs: QmRmHVyre1jRHgDfmUYCeTPQSc6TLh8iB3nyyiZeVcF4Xd
//         try {
//             const removeFromIpfs = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
//                 headers: {
//                     pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API,
//                     pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
//                 }
//             }); 
//             const tx = await contract.removeFile(account, url); // Assuming 'remove' is your contract method
//             await tx.wait(); // Wait for the transaction to be mined
//             console.log('URL removed successfully');
//             // getdata(contract, account);
//             window.location.reload();
//             // Optionally, refresh your data here
//         } catch (error) {
//             console.error('Error removing URL:', error);
//         }
//     };

//     // Display Images Code :
//     return (
//         <div className="flex h-screen bg-gray-100">
//             {/* Sidebar */}
//             <div className="w-64 bg-white text-gray-700 border-r">
//                 <div className="p-5 border-b">
//                     <Image src={"/logo.png"} alt='Site Logo' width={150} height={150} />
//                 </div>
//                 <div className="px-5 py-3 w-full">
//                     <button onClick={() => { setFileUploadModalOpen(true) }} className="bg-green-500 text-white px-4 py-2 rounded-lg h-full w-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700">
//                         Upload
//                     </button>
//                 </div>
//                 <ul>
//                     <li className="flex items-center p-3 hover:bg-gray-200 cursor-pointer">
//                         <FolderOpenIcon className="h-5 w-5 mr-2" /> My Drive
//                     </li>
//                     <li className="flex items-center p-3 hover:bg-gray-200 cursor-pointer">
//                         <DocumentTextIcon className="h-5 w-5 mr-2" /> Shared with me
//                     </li>

//                 </ul>
//             </div>

//             {/* Content Area */}
//             <div className="flex-1 flex flex-col">
//                 {/* Top Bar */}
//                 <div className="p-5 bg-white shadow-sm flex items-center">
//                     <div className="flex bg-gray-200 p-2 rounded-lg flex-1">
//                         <MagnifyingGlassIcon className="h-9 w-9 text-gray-500" />
//                         <input type="search" placeholder="Search in Drive" className="bg-transparent p-2 w-full focus:outline-none" />
//                     </div>
//                     <div className="ml-5 cursor-pointer" onClick={toggleDropdown}>
//                         <Image src={"/user.png"} width={50} alt='User Icon' height={50} className='' />
//                         {/* Dropdown Menu */}
//                         {isDropdownOpen && <UserNavbar userAddress={account} />
//                             // (
//                             //     <div className="absolute mt-2 right-0 bg-white shadow-lg rounded-lg w-48 py-2">
//                             //         <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Name</a>
//                             //         <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Email</a>
//                             //         <a href="#" className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100">Logout</a>
//                             //     </div>
//                             // )
//                         }
//                     </div>
//                 </div>

//                 {/* Files and Folders */}
//                 <div className="flex-1 p-5 overflow-auto">
//                     <div className="grid grid-cols-4 gap-4">
//                         {data.length >0 ?data.map((item, index) => {
//                             return (
//                                 <div className="bg-white p-5 shadow rounded-lg flex flex-col items-center relative" key={index + 1}>
//                                     {/* Assuming Image is self-closing and TrashIcon is a component you can use directly */}
//                                     <Image src={item} width={200} height={200} alt='File' className="mt-2" />
//                                     <div className="absolute bottom-2 right-2">
//                                         <TrashIcon className='h-10 w-10 text-red-400 cursor-pointer' onClick={() => handleTrashClick(item)} />
//                                     </div>
//                                 </div>
//                             );
//                         }) : <div className="text-center text-2xl text-gray-500">No files found</div>}
//                     </div>
//                 </div>
//             </div>
//             <UploadFileIpfs contract={contract} account={account} provider={provider} isFileUploadModalOpen={isFileUploadModalOpen} setFileUploadModalOpen={setFileUploadModalOpen} />
//             {/* <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Smashicons - Flaticon</a> */}
//         </div>
//     );
// };

// export default MyDriveHomePage;



// // import { useState } from "react";
// // import "./Display.css";
// // const Display = ({ contract, account }) => {
// //   const [data, setData] = useState("");
// //   const getdata = async () => {
// //     let dataArray;
// //     const Otheraddress = document.querySelector(".address").value;
// //     try {
// //       if (Otheraddress) {
// //         dataArray = await contract.display(Otheraddress);
// //         console.log(dataArray);
// //       } else {
// //         dataArray = await contract.display(account);
// //       }
// //     } catch (e) {
// //       alert("You don't have access");
// //     }
// //     const isEmpty = Object.keys(dataArray).length === 0;

// //     if (!isEmpty) {
// //       const str = dataArray.toString();
// //       const str_array = str.split(",");
// //       // console.log(str);
// //       // console.log(str_array);
// //       const images = str_array.map((item, i) => {
// //         return (
// //           <a href={item} key={i} target="_blank">
// //             <img
// //               key={i}
// //               src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
// //               alt="new"
// //               className="image-list"
// //             ></img>
// //           </a>
// //         );
// //       });
// //       setData(images);
// //     } else {
// //       alert("No image to display");
// //     }
// //   };
// //   return (

// //     <>
// //       <div className="image-list">{data}</div>
// //       <input
// //         type="text"
// //         placeholder="Enter Address"
// //         className="address"
// //       ></input>
// //       <button className="center button" onClick={getdata}>
// //         Get Data
// //       </button>
// //     </>
// //   );
// // };
// // export default Display;

// 'use client';
// import { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import Image from 'next/image';
// import { DocumentTextIcon, FolderOpenIcon, MagnifyingGlassIcon, TrashIcon, ShareIcon } from '@heroicons/react/24/outline'; // Added ShareIcon
// import Upload from "../components/artifacts/contracts/UploadFile.sol/UploadFile.json";
// import UserNavbar from '../components/User-Navbar/UserNavbar';
// import UploadFileIpfs from '../components/Upload-Ipfs-Modal/UploadFileIpfs';
// import axios from 'axios';

// const MyDriveHomePage = () => {
//     // State to manage dropdown visibility
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//     // Function to toggle dropdown menu
//     const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

//     // Contract and its Code
//     const [account, setAccount] = useState("");
//     const [contract, setContract] = useState(null);
//     const [provider, setProvider] = useState(null);
//     const [data, setData] = useState([]);

//     // Upload File Modal 
//     const [isFileUploadModalOpen, setFileUploadModalOpen] = useState(false);

//     useEffect(() => {
//         // Ensure `ethereum` is available in the window object
//         if (window.ethereum !== null) {
//             const provider = new ethers.BrowserProvider(window.ethereum);

//             // Functions
//             const loadProvider = async () => {
//                 // Listen for chain and account changes
//                 window.ethereum.on("chainChanged", () => window.location.reload());
//                 window.ethereum.on("accountsChanged", () => window.location.reload());

//                 // Request accounts
//                 await provider.send("eth_requestAccounts", []);
//                 const signer = await provider.getSigner();

//                 const address = await signer.getAddress();
//                 console.log(address);
//                 setAccount(address);

//                 const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//                 const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
//                 console.log(contract, address);
//                 getdata(contract, address);
//                 setContract(contract);
//                 setProvider(provider);
//             };

//             loadProvider().catch(console.error);
//         }

//     }, []);

//     const getdata = async (contract, account) => {
//         let dataArray;
//         try {
//             dataArray = await contract.displayFiles(account);
//             console.log(dataArray);
//         } catch (e) {
//             console.log(e.message);
//         }
//         const isEmpty = dataArray ? Object.keys(dataArray).length === 0 : true;

//         if (!isEmpty) {
//             setData(Object.values(dataArray));
//             console.log(Object.values(dataArray));
//         } else {
//             setData(Object.values(dataArray));
//             console.log("No image to display");
//         }
//     };

//     const handleTrashClick = async (url) => {
//         const parts = url.split('/');
//         const cid = parts[parts.length - 1];  // Outputs: QmRmHVyre1jRHgDfmUYCeTPQSc6TLh8iB3nyyiZeVcF4Xd
//         try {
//             const removeFromIpfs = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
//                 headers: {
//                     pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API,
//                     pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
//                 }
//             }); 
//             const tx = await contract.removeFile(account, url); // Assuming 'remove' is your contract method
//             await tx.wait(); // Wait for the transaction to be mined
//             console.log('URL removed successfully');
//             window.location.reload();
//         } catch (error) {
//             console.error('Error removing URL:', error);
//         }
//     };

//     const handleShareClick = (url) => {
//         // Functionality for sharing the file
//         navigator.clipboard.writeText(url)
//             .then(() => {
//                 alert('URL copied to clipboard');
//             })
//             .catch(err => {
//                 console.error('Error copying URL: ', err);
//             });
//     };

//     return (
//         <div className="flex h-screen bg-gray-100">
//             {/* Sidebar */}
//             <div className="w-64 bg-white text-gray-700 border-r">
//                 <div className="p-5 border-b">
//                     <Image src={"/logo.png"} alt='Site Logo' width={150} height={150} />
//                 </div>
//                 <div className="px-5 py-3 w-full">
//                     <button onClick={() => { setFileUploadModalOpen(true) }} className="bg-green-500 text-white px-4 py-2 rounded-lg h-full w-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700">
//                         Upload
//                     </button>
//                 </div>
//                 <ul>
//                     <li className="flex items-center p-3 hover:bg-gray-200 cursor-pointer">
//                         <FolderOpenIcon className="h-5 w-5 mr-2" /> My Drive
//                     </li>
//                     <li className="flex items-center p-3 hover:bg-gray-200 cursor-pointer">
//                         <DocumentTextIcon className="h-5 w-5 mr-2" /> Shared with me
//                     </li>
//                 </ul>
//             </div>

//             {/* Content Area */}
//             <div className="flex-1 flex flex-col">
//                 {/* Top Bar */}
//                 <div className="p-5 bg-white shadow-sm flex items-center">
//                     <div className="flex bg-gray-200 p-2 rounded-lg flex-1">
//                         <MagnifyingGlassIcon className="h-9 w-9 text-gray-500" />
//                         <input type="search" placeholder="Search in Drive" className="bg-transparent p-2 w-full focus:outline-none" />
//                     </div>
//                     <div className="ml-5 cursor-pointer" onClick={toggleDropdown}>
//                         <Image src={"/user.png"} width={50} alt='User Icon' height={50} className='' />
//                         {isDropdownOpen && <UserNavbar userAddress={account} />}
//                     </div>
//                 </div>

//                 {/* Files and Folders */}
//                 <div className="flex-1 p-5 overflow-auto">
//                     <div className="grid grid-cols-4 gap-4">
//                         {data.length > 0 ? data.map((item, index) => (
//                             <div className="bg-white p-5 shadow rounded-lg flex flex-col items-center relative" key={index}>
//                                 <Image src={item} width={200} height={200} alt='File' className="mt-2" />
//                                 <div className="h-8">

//                                 </div>
//                                 <div className="absolute bottom-2 right-2 flex space-x-2">
//                                     <TrashIcon className='h-10 w-10 text-red-400 cursor-pointer' onClick={() => handleTrashClick(item)} />
//                                     <ShareIcon className='h-10 w-10 text-blue-400 cursor-pointer' onClick={() => handleShareClick(item)} />
//                                 </div>
//                             </div>
//                         )) : <div className="text-center text-2xl text-gray-500">No files found</div>}
//                     </div>
//                 </div>
//             </div>
//             <UploadFileIpfs contract={contract} account={account} provider={provider} isFileUploadModalOpen={isFileUploadModalOpen} setFileUploadModalOpen={setFileUploadModalOpen} />
//         </div>
//     );
// };

// export default MyDriveHomePage;


// -------
'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Image from 'next/image';
import Upload from "../components/artifacts/contracts/UploadFile.sol/UploadFile.json";
import UserNavbar from '../components/User-Navbar/UserNavbar';
import UploadFileIpfs from '../components/Upload-Ipfs-Modal/UploadFileIpfs';
import ShareFileModal from '../components/ShareFileModal/ShareFileModal'; // Import ShareModal
import ProtectedComponent from '@/utils/protectedComponent';
import { DocumentTextIcon, FolderOpenIcon, MagnifyingGlassIcon, TrashIcon, ShareIcon, LockClosedIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'; // Added ShareIcon
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
    const handleComponentSwitch = (number) => {
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
                console.log(address);
                setAccount(address);

                const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
                const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
                console.log(contract, address);
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
            dataArray = await contract.displayFiles(account);
            console.log(dataArray);
        } catch (e) {
            console.log(e.message);
        }
        const isEmpty = dataArray ? Object.keys(dataArray).length === 0 : true;


        if (!isEmpty) {
            let tempArray = Object.values(dataArray);
            setData(tempArray);
            const dataMap = new Map();
            tempArray.forEach(item => {
                dataMap.set(item, true);
            });
            setDataLock(dataMap);
            console.log(Object.values(dataArray));
        } else {
            setData(Object.values(dataArray));
            console.log("No image to display");
        }
    };
    const getSharedData = async (contract, account) => {
        let dataArray;
        try {
            dataArray = await contract.sharedWithMe(account);
            console.log(dataArray);
        } catch (e) {
            console.log(e.message);
        }
        const isEmpty = dataArray ? Object.keys(dataArray).length === 0 : true;

        if (!isEmpty) {
            let tempArray = Object.values(dataArray);
            setData(tempArray);
            const dataMap = new Map();
            tempArray.forEach(item => {
                dataMap.set(item, true);
            });
            setDataLock(dataMap);
            console.log(Object.values(dataArray));
        } else {
            setData(Object.values(dataArray));
            console.log("No Items Shared with this User");
        }
    };

    const handleTrashClick = async (url) => {
        const parts = url.split('/');
        const cid = parts[parts.length - 1];
        try {
            const removeFromIpfs = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
                headers: {
                    pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API,
                    pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
                }
            });
            const tx = await contract.removeFile(account, url);
            await tx.wait();
            console.log('URL removed successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error removing URL:', error);
        }
    };

    const handleShareClick = (file) => {
        console.log(file);
        setCurrentFile(file);
        setShareModalOpen(true);
    };

    const handleFileUnlock = (fileUrl) => {
        setLockedFileUrl(fileUrl);
        setIsFaceAuthModalOpen(true);
    }

    const handleFileDownload = (fileUrl, fileName) => {
        // using  method to Download the file
        fetch(fileUrl).then((response) => {
            response.blob().then((blob) => {

                // Creating new object of the file
                const fileURL =
                    window.URL.createObjectURL(blob);

                // Setting various property values
                let alink = document.createElement("a");
                alink.href = fileURL;
                alink.download = fileName;
                alink.click();
            });
        });
    };

    return (
        <>
            <FaceRecognitionModal
                isOpen={isFaceAuthModalOpen}
                onClose={() => setIsFaceAuthModalOpen(false)}
                btnText={"Verify"}
                data={lockedFileUrl}
                setterFunction={setDataLock}
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
                            <input type="search" placeholder="Search in Drive" className="bg-transparent p-2 w-full focus:outline-none" />
                        </div>
                        <div className="ml-5 cursor-pointer" onClick={toggleDropdown}>
                            <Image src={"/user.png"} width={50} alt='User Icon' height={50} className='' />
                            {isDropdownOpen && <UserNavbar userAddress={account} />}
                        </div>
                    </div>

                    {/* Files and Folders */}
                    <div className="flex-1 p-5 overflow-auto">
                        <div className="grid grid-cols-4 gap-4">
                            {data.length > 0 && activeComponent == 0 ? data.map((item, index) => (
                                <div className="bg-white p-5 shadow rounded-lg flex flex-col items-center relative" key={index}>
                                    <div className="relative w-full" style={{ paddingBottom: '75%' }}> {/* 4:3 Aspect Ratio */}
                                        <Image objectFit="cover" layout="fill" src={item} alt='File' className={`absolute inset-0 ${dataLock.get(item) ? 'filter blur-lg' : ''}`} />
                                        {dataLock.get(item) && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                <LockClosedIcon
                                                    className='h-10 w-10 text-white cursor-pointer'
                                                    onClick={() => handleFileUnlock(item)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {dataLock.get(item) != true ? (
                                        <>
                                            <div className="mt-2 w-full flex justify-between">
                                                <div className='flex-1 flex justify-center'>
                                                    <ShareIcon className='h-10 w-10 text-blue-400 cursor-pointer' onClick={() => handleShareClick(item)} />
                                                </div>
                                                <div className='flex-1 flex justify-center'>
                                                    <ArrowDownTrayIcon className='h-10 w-10 text-blue-400 cursor-pointer' onClick={() => handleFileDownload(item, "test.jpg")} />
                                                </div>
                                                <div className='flex-1 flex justify-center'>
                                                    <TrashIcon className='h-10 w-10 text-red-400 cursor-pointer' onClick={() => handleTrashClick(item)} />
                                                </div>
                                            </div>
                                        </>
                                    ) : (<></>)}


                                </div>
                            )) : (activeComponent == 0 && data.length == 0) && <div className="text-center text-2xl text-gray-500">No files found</div>}
                            {data.length > 0 && activeComponent == 1 ? data.map((item, index) => (
                                <div className="bg-white p-5 shadow rounded-lg flex flex-col items-center relative" key={index}>
                                    {/* <Image src={item} width={200} height={200} alt='File' className="mt-2" /> */}
                                    <div className="relative w-full" style={{ paddingBottom: '75%' }}> {/* 4:3 Aspect Ratio */}
                                        <Image objectFit="cover" layout="fill" src={item} alt='File' className={`absolute inset-0 ${dataLock.get(item) ? 'filter blur-lg' : ''}`} />
                                        {dataLock.get(item) && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                <LockClosedIcon
                                                    className='h-10 w-10 text-white cursor-pointer'
                                                    onClick={() => handleFileUnlock(item)}
                                                />
                                            </div>
                                        )}
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
                    fileUrl={currentFile}
                    contract={contract}
                    ownerAddress={account}
                />
            </div>
        </>

    );
};

export default ProtectedComponent(MyDriveHomePage);
