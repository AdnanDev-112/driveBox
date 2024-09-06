require("@nomicfoundation/hardhat-ignition-ethers");
require("hardhat-gas-reporter");

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
  gasReporter: {
    enabled: true,
    currency: 'GBP',  
    gasPrice: 1.273097437,
    showTimeSpent: true,
    precision: 8,
  }
};

