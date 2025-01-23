const app = require("./app");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");
const Web3 = require('web3');
const PORT = process.env.PORT || 3099;

// Initialize Web3 with Ethereum mainnet
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'); // Замените на ваш Infura ID

// Smart contract ABIs
const USDT_ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    }
];

// Contract addresses
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const USDT_CONTRACT = new web3.eth.Contract(USDT_ABI, USDT_ADDRESS);

// API methods for smart contract interactions
async function getUSDTTotalSupply() {
    try {
        const totalSupply = await USDT_CONTRACT.methods.totalSupply().call();
        console.log('USDT Total Supply:', web3.utils.fromWei(totalSupply, 'mwei')); // USDT uses 6 decimals
    } catch (error) {
        console.error('Error fetching USDT total supply:', error);
    }
}

async function getUSDTBalance(address) {
    try {
        const balance = await USDT_CONTRACT.methods.balanceOf(address).call();
        console.log(`USDT Balance for ${address}:`, web3.utils.fromWei(balance, 'mwei'));
    } catch (error) {
        console.error('Error fetching USDT balance:', error);
    }
}

// Call the methods every 5 minutes
setInterval(() => {
    getUSDTTotalSupply();
    getUSDTBalance('0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503'); // Binance hot wallet
}, 300000);

// connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(PORT, () => {
  console.log(`Server running`);
  // Initial call
  getUSDTTotalSupply();
  getUSDTBalance('0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503');
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// UncaughtException Error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});