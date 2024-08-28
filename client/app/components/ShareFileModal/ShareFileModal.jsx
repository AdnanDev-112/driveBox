'use client';
import { useState , useEffect } from 'react';

const ShareModal = ({ isOpen, onClose, fileData,contract,ownerAddress }) => {
    if (!fileData) return null;

    const [otherUserAddress, setOthUserAdd] = useState('');
    const [sharedUsers, setSharedUsers] = useState([
     ]);
    const fileName = fileData.fileName;
    const fileCID = fileData.fileCID;



    const handleShare = async () => {
        let dataArray;
        try {
            dataArray = await contract.allowAccess(ownerAddress,fileCID, otherUserAddress);
            setSharedUsers([...sharedUsers, otherUserAddress]);
            alert('File shared successfully');
        } catch (e) {
            console.log(e.message);
        }
        setOthUserAdd('');
        // onClose();
    };
    //   function allowAccess(address owner, string memory url, address user) external {
//   function shareAccessList(address owner, string memory url) public view returns (address[] memory) {
        
useEffect(() => {
    if (!isOpen) return;
    // Hypothetical logic to fetch shared users list on component mount or when fileUrl changes
    const fetchSharedUsers = async () => {
        try {
            const sharedUsersList = await contract.shareAccessList(ownerAddress, fileCID);
            setSharedUsers(sharedUsersList);
        } catch (e) {
            console.error("Failed to fetch shared users:", e.message);
        }
    };

    if (isOpen) { // Assuming we only want to fetch when the modal is open
        fetchSharedUsers();
    }
    console.log("useEffect called with isOpen, fileUrl:", isOpen, fileCID);
}, [isOpen]); // Dependencies: isOpen, fileUrl, and contract

// Debugging step: Ensure useEffect is called


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
