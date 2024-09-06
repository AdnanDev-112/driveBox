# Initialized Hardhat Project
This is the initialized Hardhat Project
Hardhat commands include :

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/FileApp.js
```

# Instructions to run the project : 

Smart Contract can be found under /contracts folder 

Steps to run the project :

Run the following commands  in the following sequence:

1) `npm i` 
2) `npx hardhat node` in another  terminal as this represent running blockchain
3) `npx hardhat ignition deploy ignition/modules/FileApp.js --network localhost`
Once the contract has been deployed on the blockchain
4) Change the directory to client folder and install node modules using `npm i`
5) Once installed run the project using `npm run dev`

If any error occurs due to conflicting packages during installing node modules,
then `--legacy-peer-deps` flag shall be used `npm i --legacy-peer-deps`


# Contract Deployment:
Once the contract has been deployed the terminal running hardhat node 
will display the information related to Smart Contract.
the log `Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3`
is very crucial as it points to the smart contract
this address has been used throughout the code .
If the address has changed then it shall be replaced in the code
as the current address is `0x5fbdb2315678afecb367f032d93f642f64180aa3`

# AWS Setup
The docs at https://ui.docs.amplify.aws/react/connected-components/liveness 
can be followed to setup AWS related services.

# Pinata API Keys
The docs at https://docs.pinata.cloud/quickstart
can be followed to setup Pinata

# MetaMask Hardhat Configuration 
To configure metamask to connect with local hardhat blockchain,
docs at https://docs.metamask.io/wallet/how-to/run-devnet/ can be followed.

# Gas Calculator 
Command `node gasCostCalculator.js` can be used to run the script to evaluate gas fees.


# Important commands :
AWS Rekognition to delete saved faces:
aws rekognition delete-faces --collection-id compare-face-dev --face-ids $(aws rekognition list-faces --collection-id compare-face-dev --query 'Faces[*].FaceId' --output text)

# HardHat :
`npx hardhat clean` To Clear cache and old smart contract

# Next :
rm -rf .next && npm run dev