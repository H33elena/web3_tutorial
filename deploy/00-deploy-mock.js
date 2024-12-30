const {DECIMAL ,INITIAL_ANSWER,developmentChains}=require("../helper-hardhat-config")


module.exports=async({getNamedAccounts,deployment})=>{  
     if(developmentChains.includes(network.name)){
        const firstAccount= (await getNamedAccounts()).firstAccount
        const {deploy}=deployment
        deploy("MockV3Aggregator",{
            from :firstAccount,
            args :[DECIMAL,INITIAL_ANSWER],
            log:true
        })
     }else{
        console.log("environment is not local,mock contract deployment skipped")
     }
}
module.exports.tags =["all","mock"]