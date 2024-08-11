// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.9;

contract UploadFile {
  
  struct Access {
    address user;
    string url;
    bool access;
  }

  mapping(address => string[]) private userFiles;
  mapping(address => mapping(string => mapping(address => bool))) private fileAccess;
  mapping(address => mapping(string => address[])) private fileAccessUsers;
  mapping(address => Access[]) private accessList;
  mapping(address => mapping(address => mapping(string => bool))) private previousFileAccess;

  // Add a file URL for the user
  function addFile(address user, string memory url) external {
    userFiles[user].push(url);
  }

  // Remove a file URL for the user
  function removeFile(address user, string memory urlToRemove) external {
    uint length = userFiles[user].length;
    for (uint i = 0; i < length; i++) {
        if (keccak256(abi.encodePacked(userFiles[user][i])) == keccak256(abi.encodePacked(urlToRemove))) {
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

//   // Hypothetical mapping to track user addresses for each file URL under an owner
//     mapping(address => mapping(string => address[])) private fileAccessUsers;

//     // Function to add user access (hypothetical example)
//     function addUserAccess(address owner, string memory url, address user) public {
//         fileAccess[owner][url][user] = true;
//         // Add the user to the tracking array if not already present
//         // This part is simplified and would need checks to avoid duplicates
//         fileAccessUsers[owner][url].push(user);
//     }

//     // Modified shareAccessList function
//     function shareAccessList(address owner, string memory url) public view returns (address[] memory) {
//         return fileAccessUsers[owner][url];
//     }

  // Allow access to a specific file for a user
  function allowAccess(address owner, string memory url, address user) external {
    fileAccess[owner][url][user] = true;

    if (previousFileAccess[user][owner][url]) {
      for (uint i = 0; i < accessList[user].length; i++) {
        if (accessList[user][i].user == user && keccak256(abi.encodePacked(accessList[user][i].url)) == keccak256(abi.encodePacked(url))) {
          accessList[user][i].access = true;
          
        }
      }
    } else {
      fileAccessUsers[owner][url].push(user);
      accessList[user].push(Access(owner, url, true));
      previousFileAccess[user][owner][url] = true;
    }
  }

  // Disallow access to a specific file for a user -- Need fix here
  function disallowAccess(address owner, string memory url, address user) public {
    fileAccess[owner][url][user] = false;

    for (uint i = 0; i < accessList[owner].length; i++) {
      if (accessList[owner][i].user == user && keccak256(abi.encodePacked(accessList[owner][i].url)) == keccak256(abi.encodePacked(url))) {
        accessList[owner][i].access = false;
      }
    }
  }

  // Display the user's file URLs
  function displayFiles(address user) external view returns (string[] memory) {
    return userFiles[user];
  }

  // Get all files shared with the caller
  function sharedWithMe(address caller) external view returns (string[] memory) {
    uint count = 0;

    // First, count the number of shared files
    for (uint i = 0; i < accessList[caller].length; i++) {
      if (accessList[caller][i].access) {
        count++;
      }
    }

    // Create an array to hold the shared file URLs
    string[] memory sharedFiles = new string[](count);
    uint index = 0;

    // Populate the array with shared file URLs
    for (uint i = 0; i < accessList[caller].length; i++) {
      if (accessList[caller][i].access) {
        sharedFiles[index] = accessList[caller][i].url;
        index++;
      }
    }

    return sharedFiles;
  }

  // Share access list for a specific file URL
  function shareAccessList(address owner, string memory url) public view returns (address[] memory) {
    // uint count = 0;

 return fileAccessUsers[owner][url];

    // // First, count the number of users with access to the specific file
    // for (uint i = 0; i < accessList[owner].length; i++) {
    //   if (keccak256(abi.encodePacked(accessList[owner][i].url)) == keccak256(abi.encodePacked(url)) && accessList[owner][i].access) {
    //     count++;
    //   }
    // }

    // // Create an array to hold the addresses
    // address[] memory usersWithAccess = new address[](count);
    // uint index = 0;

    // // Populate the array with addresses
    // for (uint i = 0; i < accessList[owner].length; i++) {
    //   if (keccak256(abi.encodePacked(accessList[owner][i].url)) == keccak256(abi.encodePacked(url)) && accessList[owner][i].access) {
    //     usersWithAccess[index] = accessList[owner][i].user;
    //     index++;
    //   }
    // }

    // return usersWithAccess;
    // First, count the number of users with access to the specific file


  }
}

// ------------- Good start but needs more work done on it ----------------
// pragma solidity >=0.8.9;

// contract UploadFile {
  
//   struct Access {
//     address user;
//     string url;
//     bool access;
//   }

//   mapping(address => string[]) private userFiles;
//   mapping(address => mapping(string => mapping(address => bool))) private fileAccess;
//   mapping(address => Access[]) private accessList;
//   mapping(address => mapping(address => mapping(string => bool))) private previousFileAccess;

//   // Add a file URL for the user
//   function addFile(address user, string memory url) external {
//     userFiles[user].push(url);
//   }

//   // Remove a file URL for the user
//   function removeFile(address user, string memory urlToRemove) external {
//     uint length = userFiles[user].length;
//     for (uint i = 0; i < length; i++) {
//         if (keccak256(abi.encodePacked(userFiles[user][i])) == keccak256(abi.encodePacked(urlToRemove))) {
//             if (i != length - 1) {
//                 // Swap with the last element
//                 userFiles[user][i] = userFiles[user][length - 1];
//             }
//             // Remove the last element
//             userFiles[user].pop();
//             break;
//         }
//     }
//   }

//   // Allow access to a specific file for a user
//   function allowAccess(address owner, string memory url, address user) external {
//     fileAccess[owner][url][user] = true;

//     if (previousFileAccess[owner][user][url]) {
//       for (uint i = 0; i < accessList[owner].length; i++) {
//         if (accessList[owner][i].user == user && keccak256(abi.encodePacked(accessList[owner][i].url)) == keccak256(abi.encodePacked(url))) {
//           accessList[owner][i].access = true;
//         }
//       }
//     } else {
//       accessList[owner].push(Access(user, url, true));
//       previousFileAccess[owner][user][url] = true;
//     }
//   }

//   // Disallow access to a specific file for a user
//   function disallowAccess(address owner, string memory url, address user) public {
//     fileAccess[owner][url][user] = false;

//     for (uint i = 0; i < accessList[owner].length; i++) {
//       if (accessList[owner][i].user == user && keccak256(abi.encodePacked(accessList[owner][i].url)) == keccak256(abi.encodePacked(url))) {
//         accessList[owner][i].access = false;
//       }
//     }
//   }

//   // Display the user's file URLs
//   function displayFiles(address user) external view returns (string[] memory) {
//     return userFiles[user];
//   }

//   // Get all files shared with the caller
//   function sharedWithMe(address caller) external view returns (string[] memory) {
//     uint count = 0;

//     // First, count the number of shared files
//     for (uint i = 0; i < accessList[caller].length; i++) {
//       if (accessList[caller][i].access) {
//         count++;
//       }
//     }

//     // Create an array to hold the shared file URLs
//     string[] memory sharedFiles = new string[](count);
//     uint index = 0;

//     // Populate the array with shared file URLs
//     for (uint i = 0; i < accessList[caller].length; i++) {
//       if (accessList[caller][i].access) {
//         sharedFiles[index] = accessList[caller][i].url;
//         index++;
//       }
//     }

//     return sharedFiles;
//   }

//   // Share access list for a specific file URL
//   function shareAccessList(address owner, string memory url) public view returns (address[] memory) {
//     uint count = 0;

//     // First, count the number of users with access to the specific file
//     for (uint i = 0; i < accessList[owner].length; i++) {
//       if (keccak256(abi.encodePacked(accessList[owner][i].url)) == keccak256(abi.encodePacked(url)) && accessList[owner][i].access) {
//         count++;
//       }
//     }

//     // Create an array to hold the addresses
//     address[] memory usersWithAccess = new address[](count);
//     uint index = 0;

//     // Populate the array with addresses
//     for (uint i = 0; i < accessList[owner].length; i++) {
//       if (keccak256(abi.encodePacked(accessList[owner][i].url)) == keccak256(abi.encodePacked(url)) && accessList[owner][i].access) {
//         usersWithAccess[index] = accessList[owner][i].user;
//         index++;
//       }
//     } 
//     return usersWithAccess;
//   }
// }





// ------------------------------------SOL New Not Working------------------------------------
// pragma solidity >=0.8.9;

// contract UploadFile {
  
//   struct Access {
//     address user;
//     string url;
//     bool access;
//   }

//   mapping(address => string[]) private userFiles;
//   mapping(address => mapping(string => mapping(address => bool))) private fileAccess;
//   mapping(address => Access[]) private accessList;
//   mapping(address => mapping(address => mapping(string => bool))) private previousFileAccess;

//   // Add a file URL for the user
//   function addFile(string memory url) external {
//     userFiles[msg.sender].push(url);
//   }

//   // Remove a file URL for the user
//   function removeFile(string memory urlToRemove) external {
//     uint length = userFiles[msg.sender].length;
//     for (uint i = 0; i < length; i++) {
//         if (keccak256(abi.encodePacked(userFiles[msg.sender][i])) == keccak256(abi.encodePacked(urlToRemove))) {
//             if (i != length - 1) {
//                 // Swap with the last element
//                 userFiles[msg.sender][i] = userFiles[msg.sender][length - 1];
//             }
//             // Remove the last element
//             userFiles[msg.sender].pop();
//             break;
//         }
//     }
//   }

//   // Allow access to a specific file for a user
//   function allowAccess(string memory url, address user) external {
//     fileAccess[msg.sender][url][user] = true;

//     if (previousFileAccess[msg.sender][user][url]) {
//       for (uint i = 0; i < accessList[msg.sender].length; i++) {
//         if (accessList[msg.sender][i].user == user && keccak256(abi.encodePacked(accessList[msg.sender][i].url)) == keccak256(abi.encodePacked(url))) {
//           accessList[msg.sender][i].access = true;
//         }
//       }
//     } else {
//       accessList[msg.sender].push(Access(user, url, true));
//       previousFileAccess[msg.sender][user][url] = true;
//     }
//   }

//   // Disallow access to a specific file for a user
//   function disallowAccess(string memory url, address user) public {
//     fileAccess[msg.sender][url][user] = false;

//     for (uint i = 0; i < accessList[msg.sender].length; i++) {
//       if (accessList[msg.sender][i].user == user && keccak256(abi.encodePacked(accessList[msg.sender][i].url)) == keccak256(abi.encodePacked(url))) {
//         accessList[msg.sender][i].access = false;
//       }
//     }
//   }

//   // Display the user's file URLs
//   function displayFiles() external view returns (string[] memory) {
//     return userFiles[msg.sender];
//   }

//   // Get all files shared with the caller
//   function sharedWithMe() external view returns (string[] memory) {
//     uint count = 0;

//     // First, count the number of shared files
//     for (uint i = 0; i < accessList[msg.sender].length; i++) {
//       if (accessList[msg.sender][i].access) {
//         count++;
//       }
//     }

//     // Create an array to hold the shared file URLs
//     string[] memory sharedFiles = new string[](count);
//     uint index = 0;

//     // Populate the array with shared file URLs
//     for (uint i = 0; i < accessList[msg.sender].length; i++) {
//       if (accessList[msg.sender][i].access) {
//         sharedFiles[index] = accessList[msg.sender][i].url;
//         index++;
//       }
//     }

//     return sharedFiles;
//   }

//   // Share access list for a specific file URL
//   function shareAccessList(string memory url) public view returns (address[] memory) {
//     uint count = 0;

//     // First, count the number of users with access to the specific file
//     for (uint i = 0; i < accessList[msg.sender].length; i++) {
//       if (keccak256(abi.encodePacked(accessList[msg.sender][i].url)) == keccak256(abi.encodePacked(url)) && accessList[msg.sender][i].access) {
//         count++;
//       }
//     }

//     // Create an array to hold the addresses
//     address[] memory usersWithAccess = new address[](count);
//     uint index = 0;

//     // Populate the array with addresses
//     for (uint i = 0; i < accessList[msg.sender].length; i++) {
//       if (keccak256(abi.encodePacked(accessList[msg.sender][i].url)) == keccak256(abi.encodePacked(url)) && accessList[msg.sender][i].access) {
//         usersWithAccess[index] = accessList[msg.sender][i].user;
//         index++;
//       }
//     }

//     return usersWithAccess;
//   }
// }



// ------------------------------------SOL Old Stable------------------------------------
// pragma solidity >=0.8.9;
// // pragma solidity >=0.7.0 <0.9.0;

// contract UploadFile {
  
//   struct Access{
//      address user; 
//      bool access; //true or false
//   }
//   mapping(address=>string[]) value;
//   mapping(address=>mapping(address=>bool)) ownership;
//   mapping(address=>Access[]) accessList;
//   mapping(address=>mapping(address=>bool)) previousData;

//   function add(address _user,string memory url) external {
//       value[_user].push(url);
//   }
//   function remove(address _user, string memory urlToRemove) external {
//     require(_user == msg.sender, "Only the owner can remove URLs"); // Optional: Restrict this function to the owner of the URLs
//     uint length = value[_user].length;
//     for (uint i = 0; i < length; i++) {
//         if (keccak256(abi.encodePacked(value[_user][i])) == keccak256(abi.encodePacked(urlToRemove))) {
//             if (i != length - 1) {
//                 // Swap with the last element
//                 value[_user][i] = value[_user][length - 1];
//             }
//             // Remove the last element
//             value[_user].pop();
//             break;
//         }
//     }
// }
//   function allow(address user) external {//def
//       ownership[msg.sender][user]=true; 
//       if(previousData[msg.sender][user]){
//          for(uint i=0;i<accessList[msg.sender].length;i++){
//              if(accessList[msg.sender][i].user==user){
//                   accessList[msg.sender][i].access=true; 
//              }
//          }
//       }else{
//           accessList[msg.sender].push(Access(user,true));  
//           previousData[msg.sender][user]=true;  
//       }
    
//   }
//   function disallow(address user) public{
//       ownership[msg.sender][user]=false;
//       for(uint i=0;i<accessList[msg.sender].length;i++){
//           if(accessList[msg.sender][i].user==user){ 
//               accessList[msg.sender][i].access=false;  
//           }
//       }
//   }

//   function display(address _user) external view returns(string[] memory){
//       require(_user==msg.sender || ownership[_user][msg.sender],"You don't have access");
//       return value[_user];
//   }

//   function shareAccess() public view returns(Access[] memory){
//       return accessList[msg.sender];
//   }
// }