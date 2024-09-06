const { ethers } = require('ethers');
const axios = require('axios');

// Function to get the current gas price from the Ethereum network
async function getGasPrice() {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Use your local node or an external provider
    const feeData = await provider.getFeeData(); // Fetch gas-related fee data
    return ethers.formatUnits(feeData.gasPrice, 'gwei'); // Convert gas price from wei to gwei
}

// Function to get the current ETH to GBP exchange rate using CoinGecko API
async function getETHtoGBP() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=gbp');
        return response.data.ethereum.gbp; // Return ETH to GBP rate
    } catch (error) {
        console.error('Error fetching ETH to GBP rate:', error);
        throw error;
    }
}

// Function to calculate the total gas cost in GBP
async function calculateGasCost(gasUnits) {
    try {
        const gasPriceInGwei = await getGasPrice();
        const ethToGBP = await getETHtoGBP();

        // Calculate the total gas cost in ETH
        const gasCostInETH = (gasUnits * gasPriceInGwei) / 1e9; // Convert gwei to ETH
        const gasCostInGBP = gasCostInETH * ethToGBP; // Convert ETH to GBP

        console.log(`Gas Price: ${gasPriceInGwei} gwei`);
        console.log(`ETH to GBP Rate: £${ethToGBP}`);
        console.log(`Gas Cost for ${gasUnits} gas: £${gasCostInGBP.toFixed(4)} GBP`);
    } catch (error) {
        console.error('Error calculating gas cost:', error);
    }
}

// Example usage: calculate gas cost for 201,055 gas units
calculateGasCost(201055);
