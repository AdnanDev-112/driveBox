'use client';
import { useState, useEffect } from 'react';
import {  TrashIcon } from '@heroicons/react/24/outline'; 


const ShareModal = ({ isOpen, onClose, fileData, contract, ownerAddress }) => {
    if (!fileData) return null;
    const [otherUserAddress, setOthUserAdd] = useState('');
    const [sharedUsers, setSharedUsers] = useState([
    ]);
    const fileName = fileData.fileName;
    const fileCID = fileData.fileCID;

    const fetchSharedUsers = async () => {
        try {
            const sharedUsersList = await contract.getAccessList(ownerAddress, fileCID);
            setSharedUsers(sharedUsersList);
        } catch (e) {
            console.error("Failed to fetch shared users:", e.message);
        }
    };

    const handleShare = async () => {
        let dataArray;
        try {
            dataArray = await contract.allowAccess(ownerAddress, fileCID, otherUserAddress);
            setSharedUsers([...sharedUsers, otherUserAddress]);
            alert('File shared successfully');
        } catch (e) {
            console.log(e.message);
        }
        setOthUserAdd('');
    };

    const handleShareAccessRemove = async (userToRemove) => {
        let dataArray;
        try {
            dataArray = await contract.disallowAccess(ownerAddress, fileCID, userToRemove);
            alert('File Access Removed');
            await fetchSharedUsers();
        } catch (e) {
            console.log(e.message);
        }
        setOthUserAdd('');
    };


    useEffect(() => {
        if (!isOpen) return;
        fetchSharedUsers();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-1/3">
                <div className="p-5 border-b">
                    <h2 className="text-xl font-semibold">Share "{fileName}"</h2>
                </div>
                <div className="p-5">
                    <input
                        type="text"
                        placeholder="Address to Share Access with"
                        className="w-full p-2 border rounded-lg"
                        value={otherUserAddress}
                        onChange={(e) => setOthUserAdd(e.target.value)}
                    />
                    <button
                        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={handleShare}
                    >
                        Share
                    </button>
                </div>
                <div className="p-5 border-t">
                    <h3 className="text-lg font-semibold">People with access</h3>
                    <ul>
                        {sharedUsers.map((user, index) => (
                            <li key={index} className="flex items-center justify-between mt-2">
                                <span>{user}</span>
                                <span>Viewer</span>
                                <TrashIcon className='h-8 w-8 text-red-400 cursor-pointer' onClick={() => handleShareAccessRemove(user)} />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-5 border-t flex justify-end">
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
