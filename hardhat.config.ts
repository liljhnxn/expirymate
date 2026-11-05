import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

let rawPrivateKey = process.env.PRIVATE_KEY?.trim() || "";
if (rawPrivateKey && !rawPrivateKey.startsWith("0x")) {
  rawPrivateKey = `0x${rawPrivateKey}`;
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    botchainMainnet: {
      url: "https://rpc.botchain.ai",
      chainId: 677,
      accounts: rawPrivateKey ? [rawPrivateKey] : [],
    },
    botchainTestnet: {
      url: "https://rpc.bohr.life",
      chainId: 968,
      accounts: rawPrivateKey ? [rawPrivateKey] : [],
    },
  },
  etherscan: {
    apiKey: {
      botchainMainnet: "empty",
      botchainTestnet: "empty",
    },
    customChains: [
      {
        network: "botchainMainnet",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
      {
        network: "botchainTestnet",
        chainId: 968,
        urls: {
          apiURL: "https://scan.bohr.life/api",
          browserURL: "https://scan.bohr.life",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
