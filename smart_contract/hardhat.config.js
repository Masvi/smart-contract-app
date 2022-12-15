require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({path:__dirname+'/.env'})


const { ALCHEMY_API_KEY, GOERLI_PRIVATE_KEY } = process.env

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${GOERLI_PRIVATE_KEY}`],
    },
  },
};
