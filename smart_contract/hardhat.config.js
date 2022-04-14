// https://eth-ropsten.alchemyapi.io/v2/S0N_lzuAITMF_C3A1jHbpYtUCul6TIjk

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/S0N_lzuAITMF_C3A1jHbpYtUCul6TIjk',
      accounts:['1b366e12cfb31ad337fa0d374ac4f0aaa60d5d0df9d9af8a739382603cffd91f']
    }
  }
}