require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()
require("./scripts/tasks")
require("hardhat-deploy")
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");


const SEPOLIA_URL= process.env.SEPOLIA_URL
const PRIVATE_KEY= process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY= process.env.ETHERSCAN_API_KEY
const PRIVATE_KEY_1=process.env.PRIVATE_KEY_1

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  mocha:{
    timeout:300000
  },
  networks: {
    sepolia:{
    url: SEPOLIA_URL,
    accounts: [PRIVATE_KEY,PRIVATE_KEY_1],
    chainId:11155111
  }
},
etherscan:{
  apiKey:{
    sepolia: ETHERSCAN_API_KEY
  } 
},
namedAccounts:{
  firstAccount: {
    default :0
  },
  secondAccount: {
    default:1
  }
},
//设置gasReport表格是否显示
// gasReporter:{
//   enabled: false
// }
};
