const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const {assert, expect} =require("chai")
const helpers =require ("@nomicfoundation/hardhat-network-helpers")
const { developmentChains } = require("../../deploy/helper-hardhat-config")


!developmentChains.includes(network.name)? describe.skip:
describe("test fundme contract",async function() {
let fundMe
let fundMeSecondAccount
let firstAccount
let secondAccount
let mockV3Aggregator

this.beforeEach(async function() {
  await deployments.fixture(["all"])
  firstAccount = (await getNamedAccounts()).firstAccount
  secondAccount = (await getNamedAccounts()).secondAccount
  const fundMeDeployment = await deployments.get("FundMe")
  mockV3Aggregator= await deployments.get("MockV3Aggregator")
  fundMe =await ethers.getContractAt("FundMe",fundMeDeployment.address)
  fundMeSecondAccount=await ethers.getContract("FundMe",secondAccount)
})

    it("test if the owner is msg.sender",async function () {
    
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.owner()),firstAccount)
    })
    it("test if the dataffed is msg.sender",async function () {
        
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.dataFeed()),mockV3Aggregator.address)
    })
    //fund, getFund, refund

    //unit test for fund
    //window open, value greater than minium value, funder balance
    it("window closed, value greater than minium,fund failed",
        async function() {
            //make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()
            //value is greater minium value
          expect(fundMe.fund({value:ethers.parseEther("0.1")}))
          .to.be.revertedWith("window is closed")//wei
        })
    it("window open, value is less than minimum,fund failed "),
     async function(){
        expect(fundMe.fund({value: ethers.parseEther("0.01")}))
        .to.be.revertedWith("send more ETH")
     }  
     it("window open, value is greated minimum, fund success",
        async function() {
        // greater than minimum
        await fundMe.fund({value:ethers.parseEther("0.1")})
        const balance=await fundMe.fundersToAmount(firstAccount)
        expect(balance).to.be.equal(ethers.parseEther("0.1"))   
        }
     )    
     //unit test for getfund
     //onlyOwner, windowClosed, target reached
     it("not owner, window closed, target reached,getFund failed",
        async function(){
            //make sure the target is reached
            await fundMe.fund({value:ethers.parseEther("1")})

             //make sure the window is closed
             await helpers.time.increase(200)
             await helpers.mine()
             
            await expect(fundMeSecondAccount.getFund())
             .to.be.revertedWith("this function can only be called by owner")
        }
     )
     it("window open, target reached, getFund failed",
        async function() {
            await fundMe.fund({value:ethers.parseEther("1")})
            await expect(fundMe.getFund())
             .to.be.revertedWith("window is not closed")
        }
     )
     it("window is closed, target not reached,get fund failed",
        async function () {
            await fundMe.fund({value: ethers.parseEther("0.01")})
            //make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()
            
            await expect(fundMe.getFund())
            .to.be.revertedWith("target is not reached")
        }
     )
     it("window closed, target reached, getFund success",
        async function() {
            await fundMe.fund({value:ethers.parseEther("1")})
             //make sure the window is closed
             await helpers.time.increase(200)
             await helpers.mine()
             await expect(fundMe.getFund)
             .to.emit(fundMe,"FundWithdrawByOwner")
             .withArgs(ethers.parseEther("1"))

        }
     )

     //refund
     //wihdow closed, target not reached, funder has balance
     it("window open, target not reached, funder has balance",
        async function () {
            await fundMe.fund({value:ethers.parseEther("1")})
            await expect(fundMe.reFund())
            .to.be.revertedWith("window is not closed")
        }
     )
     it("window closed, target reach, funder has balance",
        async function () {
            await fundMe.fund({value:ethers.parseEther("1")})
            //make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()
            await expect(fundMe.reFund())
            .to.be.revertedWith("target is reached")
        }
     )
     it("window closed, target reach, funder has balance",
        async function () {
            await fundMe.fund({value:ethers.parseEther("0.1")})
            //make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()
            await expect(fundMeSecondAccount.reFund())
            .to.be.revertedWith("there is no fund for you")
        }
     )
     it("window closed, target not reached, funder has balance",
        async function () {
            await fundMe.fund({value:ethers.parseEther("0.1")})
            //make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()
            await expect(fundMe.reFund())
            .to.emit(fundMe,"RefundByFunder")
            .withArgs(firstAccount,ethers.parseEther("0.1"))
        }
     )


    
     


    

})