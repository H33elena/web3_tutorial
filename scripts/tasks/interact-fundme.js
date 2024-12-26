const {task} =require("hardhat/config")

task("interact-fundme")
.addParam("addr","fundme contract address")
.setAction(async(taskArgs, hre)=>{

    const fundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMe=fundMeFactory.attach(taskArgs.addr)
    
    // init 2 accounts
       const [firstAccount, secondAccount]=await ethers.getSigners()
      // fund contract with first accout
     const fundTx= await fundMe.fund({value: ethers.parseEther("0.5")})
      await fundTx.wait()
    
      //check balance of contract
     const balanceOfContract =await ethers.provider.getBalance(fundMe.target)
     console.log(`balance of contract is ${balanceOfContract}`)
    
      //fund contract with second account
     const fundTxWithSecondAccount= await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.5")})
      await fundTxWithSecondAccount.wait()
    
      //check balance of contract
      const balanceOfContractAferSecondFund =await ethers.provider.getBalance(fundMe.target)
      console.log(`balance of contract is ${balanceOfContractAferSecondFund}`)
    
      //check mapping fundersToAmount
      const firstAccountBalanceInFundMe= await fundMe.fundersToAmount(firstAccount.address)
      const secondAccountBalanceInFundMe= await fundMe.fundersToAmount(firstAccount.address)
      console.log(`balance of first account ${firstAccount.address} is ${firstAccountBalanceInFundMe}`)
      console.log(`balance of first account ${secondAccount.address} is ${secondAccountBalanceInFundMe}`)
    

})

module.exports={}