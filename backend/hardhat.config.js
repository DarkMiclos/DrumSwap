const { private_key } = require("./secret.json");

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.7.6",
      },
      {
        version: "0.5.16",
      },
      {
        version: "0.4.18",
      }
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
        details: { yul: false},
      }
    }
  },
  networks: {
    taiko: {
      url: "https://rpc.jolnir.taiko.xyz",
      chainId: 167007,
      accounts: [private_key],
    }
  },
  etherscan: {
    apiKey: {
        taiko: "42069",
    },
    customChains: [
        {
          network: "taiko",
          chainId: 167007,
          urls: {
              apiURL: "https://blockscoutapi.jolnir.taiko.xyz/api",
              browserURL: "https://explorer.jolnir.taiko.xyz",
          },
        },
    ],
  },
};
