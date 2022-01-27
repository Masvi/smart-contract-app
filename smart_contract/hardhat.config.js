require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/qGEbx5c7kdZ1naCARotvpaMmwSbIpv_L",
      accounts: ['4e6fcdb94086a71c433f389f46a8e1099da90d9cb27a9f759e543b07c40f3454']
    }
  }
};
