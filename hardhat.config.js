require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-web3");
require('@nomiclabs/hardhat-etherscan');
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config();

const URL = process.env.FULLNODE;
const BSCSCAN_KEY = process.env.BSCSCAN_KEY;
const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  defaultNetwork: 'localhost',
  solidity: {
    version: '0.5.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545/'
    },
    mainnet: {
      url: ``,
      accounts: [],
    },
    bsc_testnet: {
      url: URL,
      accounts: [privateKey],
      gas: 9500000
    }
  },
  etherscan: {
    apiKey: BSCSCAN_KEY
  }
};