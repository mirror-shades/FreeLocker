module.exports = {
  contracts_directory: "./contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0", // specify a range of Solidity compiler versions to use
    },
  },
};
