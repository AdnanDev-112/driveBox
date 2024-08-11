// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.24",
// };
// require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId:  1337 ,
    },
  },
  paths: {
    artifacts: "./client/app/components/artifacts",
  },
};


// Contract Address : 0x5FbDB2315678afecb367f032d93F642f64180aa3