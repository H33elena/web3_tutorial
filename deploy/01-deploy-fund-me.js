// function deployFunction(){
//     console.log("this is a deploy function")
// }

// module.exports.default=deployFunction
// module.exports=async(hre)=>{
//     const getNamedAccounts =hre.getNamedAccounts
//     const deployment = hre.deployment
    
//     console.log("this is a deploy function")
// }

const {network}=require("hardhat")
const {developmentChains,developmentChains,networkConfig} =require("../helper-hardhat-config")
const { LOCK_TIME,CONFIRMATIONS } = require("./helper-hardhat-config")


module.exports=async({getNamedAccounts,deployment})=>{   
    const firstAccount= (await getNamedAccounts()).firstAccount
    const {deploy}=deployment

    let dataFeedAddr
    let confirmations
    if(developmentChains.includes(network.name)){
        const mockV3Aggregator =await deployment.get("MockV3Aggregator")
        dataFeedAddr=mockV3Aggregator.address
        confirmations=0
    }else{
        dataFeedAddr= networkConfig[network.config.chainId].ethUsdDataFeed
        confirmations=CONFIRMATIONS
    }



   const fundMe=await deploy("FundMe",{
        from :firstAccount,
        args :[LOCK_TIME,dataFeedAddr],
        log:true,
        waitConfirmations:CONFIRMATIONS
    })
// remove depolyments directory or add --reset flag if you redeploy contract

    if(hre.network.config.chainId ==11155111 && process.env.ETHERSCAN_API_KEY){
        await hre.run("verify:verify",{
            address:fundMe.address,
            constructorArguments:[LOCK_TIME,dataFeedAddr],
        });
    } else{
        console.log("Network is not sepolia")
    }
    
}
module.exports.tags =["all","fundMe"]