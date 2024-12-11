require("dotenv/config");
require("@nomicfoundation/hardhat-toolbox");

const {
  BASE_SCAN_API_KEY,
  WALLET_SEP_BASE_PRIVATE_KEY,
  WALLET_CORE_PRIVATE_KEY,
} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // defaultNetwork: 'coretest',
  sourcify: {
    enabled: true,
  },
  solidity: {
    version: "0.8.20",
    settings: {
      evmVersion: "paris",
    },
    compilers: [
      {
        version: "0.8.20",
        settings: {
          evmVersion: "paris",
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  ignition: {
    gasPrice: 100000000000,
  },
  etherscan: {
    apiKey: {
      baseSepolia: BASE_SCAN_API_KEY,
    },
    customChains: [
      {
        network: "basetest",
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://sepolia.basescan.org/",
        },
      },
    ],
  },
  networks: {
    basetest: {
      url: "https://sepolia.base.org",
      accounts: [WALLET_SEP_BASE_PRIVATE_KEY],
    },
    // coretest: {
    //   minGasPrice: 100000000000,
    //   chainId: 1115,
    //   gasPrice: 100000000000,
    //   url: "https://rpc.test.btcs.network",
    //   accounts: [
    //     WALLET_CORE_PRIVATE_KEY
    //   ]
    // }
  },
};
