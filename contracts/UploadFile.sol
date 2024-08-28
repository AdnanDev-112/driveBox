// SPDX-License-Identifier: GPL-3.0

// pragma solidity >=0.8.9;

// contract UploadFile {
//     struct Access {
//         address user;
//         string url;
//         bool access;
//     }
//     struct File {
//         string fileName;
//         string cid; // CID of the file on IPFS Network
//         string encryptionKey; // Hex-encoded encryption key
//         string iv; // Hex-encoded initialization vector (IV)
//     }

//     mapping(address => string) private faceAuth;
//     mapping(address => File[]) private userFiles;
//     mapping(address => mapping(string => mapping(address => bool)))
//         private fileAccess;
//     mapping(address => mapping(string => address[])) private fileAccessUsers;
//     mapping(address => Access[]) private accessList;
//     mapping(address => mapping(address => mapping(string => bool)))
//         private previousFileAccess;

//     function addFaceAuth(address user, string memory faceAuthID) external {
//         faceAuth[user] = faceAuthID;
//     }
//     function verifyFaceAuth(
//         address user,
//         string memory faceAuthID
//     ) external view returns (bool) {
//         return
//             keccak256(abi.encodePacked(faceAuth[user])) ==
//             keccak256(abi.encodePacked(faceAuthID));
//     }

//     // Add a file URL for the user
//     function addFile(address user,string memory fileName, string memory cid, string memory encryptionKey, string memory iv) external {
//         // userFiles[user].push(url);
//         userFiles[user].push(File(fileName ,cid, encryptionKey, iv));
//     }

//     // Remove a file URL for the user
//     function removeFile(address user, string memory cidToRemove) external {
//         uint length = userFiles[user].length;
//         for (uint i = 0; i < length; i++) {
//             if (
//                 keccak256(abi.encodePacked(userFiles[user][i].cid)) ==
//                 keccak256(abi.encodePacked(cidToRemove))
//             ) {
//                 if (i != length - 1) {
//                     // Swap with the last element
//                     userFiles[user][i] = userFiles[user][length - 1];
//                 }
//                 // Remove the last element
//                 userFiles[user].pop();
//                 break;
//             }
//         }
//     }

//     // Allow access to a specific file for a user
//     function allowAccess(
//         address owner,
//         string memory url,
//         address user
//     ) external {
//         fileAccess[owner][url][user] = true;

//         if (previousFileAccess[user][owner][url]) {
//             for (uint i = 0; i < accessList[user].length; i++) {
//                 if (
//                     accessList[user][i].user == user &&
//                     keccak256(abi.encodePacked(accessList[user][i].url)) ==
//                     keccak256(abi.encodePacked(url))
//                 ) {
//                     accessList[user][i].access = true;
//                 }
//             }
//         } else {
//             fileAccessUsers[owner][url].push(user);
//             accessList[user].push(Access(owner, url, true));
//             previousFileAccess[user][owner][url] = true;
//         }
//     }

//     // Disallow access to a specific file for a user -- Need fix here
//     function disallowAccess(
//         address owner,
//         string memory url,
//         address user
//     ) public {
//         fileAccess[owner][url][user] = false;

//         for (uint i = 0; i < accessList[owner].length; i++) {
//             if (
//                 accessList[owner][i].user == user &&
//                 keccak256(abi.encodePacked(accessList[owner][i].url)) ==
//                 keccak256(abi.encodePacked(url))
//             ) {
//                 accessList[owner][i].access = false;
//             }
//         }
//     }

//     // Display the user's file URLs
//     function displayFiles(
//         address user
//     ) external view returns (File[] memory) {
//       return userFiles[user];
//     }

//     // Get all files shared with the caller
//     function sharedWithMe(
//         address caller
//     ) external view returns (string[] memory) {
//         uint count = 0;

//         // First, count the number of shared files
//         for (uint i = 0; i < accessList[caller].length; i++) {
//             if (accessList[caller][i].access) {
//                 count++;
//             }
//         }

//         // Create an array to hold the shared file URLs
//         string[] memory sharedFiles = new string[](count);
//         uint index = 0;

//         // Populate the array with shared file URLs
//         for (uint i = 0; i < accessList[caller].length; i++) {
//             if (accessList[caller][i].access) {
//                 sharedFiles[index] = accessList[caller][i].url;
//                 index++;
//             }
//         }

//         return sharedFiles;
//     }

//     // Share access list for a specific file URL
//     function shareAccessList(
//         address owner,
//         string memory url
//     ) public view returns (address[] memory) {
//         // uint count = 0;

//         return fileAccessUsers[owner][url];
//     }
// }


pragma solidity >=0.8.9;

contract UploadFile {
    struct Access {
        address user;
        string cid; // Using CID instead of URL
        bool access;
    }

    struct File {
        string fileName;
        string cid; // CID of the file on IPFS Network
        string encryptionKey; // Hex-encoded encryption key
        string iv; // Hex-encoded initialization vector (IV)
    }

    mapping(address => string) private faceAuth;
    mapping(address => File[]) private userFiles;
    mapping(address => mapping(string => mapping(address => bool))) private fileAccess;
    mapping(address => mapping(string => address[])) private fileAccessUsers;
    mapping(address => Access[]) private accessList;
    mapping(address => mapping(address => mapping(string => bool))) private previousFileAccess;

    function addFaceAuth(address user, string memory faceAuthID) external {
        faceAuth[user] = faceAuthID;
    }

    function verifyFaceAuth(
        address user,
        string memory faceAuthID
    ) external view returns (bool) {
        return
            keccak256(abi.encodePacked(faceAuth[user])) ==
            keccak256(abi.encodePacked(faceAuthID));
    }

    // Add a file for the user
    function addFile(
        address user,
        string memory fileName,
        string memory cid,
        string memory encryptionKey,
        string memory iv
    ) external {
        userFiles[user].push(File(fileName, cid, encryptionKey, iv));
    }

    // Remove a file for the user
    function removeFile(address user, string memory cidToRemove) external {
        uint length = userFiles[user].length;
        for (uint i = 0; i < length; i++) {
            if (
                keccak256(abi.encodePacked(userFiles[user][i].cid)) ==
                keccak256(abi.encodePacked(cidToRemove))
            ) {
                if (i != length - 1) {
                    // Swap with the last element
                    userFiles[user][i] = userFiles[user][length - 1];
                }
                // Remove the last element
                userFiles[user].pop();
                break;
            }
        }
    }

    // Allow access to a specific file for a user
    function allowAccess(
        address owner,
        string memory cid,
        address user
    ) external {
        fileAccess[owner][cid][user] = true;

        if (previousFileAccess[user][owner][cid]) {
            for (uint i = 0; i < accessList[user].length; i++) {
                if (
                    accessList[user][i].user == owner &&
                    keccak256(abi.encodePacked(accessList[user][i].cid)) ==
                    keccak256(abi.encodePacked(cid))
                ) {
                    accessList[user][i].access = true;
                }
            }
        } else {
            fileAccessUsers[owner][cid].push(user);
            accessList[user].push(Access(owner, cid, true));
            previousFileAccess[user][owner][cid] = true;
        }
    }

    // Disallow access to a specific file for a user
    function disallowAccess(
        address owner,
        string memory cid,
        address user
    ) public {
        fileAccess[owner][cid][user] = false;

        for (uint i = 0; i < accessList[user].length; i++) {
            if (
                accessList[user][i].user == owner &&
                keccak256(abi.encodePacked(accessList[user][i].cid)) ==
                keccak256(abi.encodePacked(cid))
            ) {
                accessList[user][i].access = false;
            }
        }
    }

    // Display the user's files
    function displayFiles(
        address user
    ) external view returns (File[] memory) {
        return userFiles[user];
    }

    // Get all files shared with the caller
    function sharedWithMe(
        address caller
    ) external view returns (File[] memory) {
        uint count = 0;

        // First, count the number of shared files
        for (uint i = 0; i < accessList[caller].length; i++) {
            if (accessList[caller][i].access) {
                count++;
            }
        }

        // Create an array to hold the shared files
        File[] memory sharedFiles = new File[](count);
        uint index = 0;

        // Populate the array with shared files
        for (uint i = 0; i < accessList[caller].length; i++) {
            if (accessList[caller][i].access) {
                string memory cid = accessList[caller][i].cid;

                // Find the file details using the CID
                for (uint j = 0; j < userFiles[accessList[caller][i].user].length; j++) {
                    if (
                        keccak256(abi.encodePacked(userFiles[accessList[caller][i].user][j].cid)) ==
                        keccak256(abi.encodePacked(cid))
                    ) {
                        sharedFiles[index] = userFiles[accessList[caller][i].user][j];
                        index++;
                        break;
                    }
                }
            }
        }

        return sharedFiles;
    }

    // Share access list for a specific file CID
    function shareAccessList(
        address owner,
        string memory cid
    ) public view returns (address[] memory) {
        return fileAccessUsers[owner][cid];
    }
}
