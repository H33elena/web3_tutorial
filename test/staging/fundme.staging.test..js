const { ethers, deployments, getNamedAccounts } = require("hardhat")
const {assert, expect} =require("chai")
const helpers =require ("@nomicfoundation/hardhat-network-helpers")
const { developmentChains } = require("../../deploy/helper-hardhat-config")


developmentChains.includes(network.name)? describe.skip:
describe("test fundme contract",async function() {
let fundMe
let firstAccount

this.beforeEach(async function() {
  await deployments.fixture(["all"])
  firstAccount = (await getNamedAccounts()).firstAccount
  const fundMeDeployment = await deployments.get("FundMe")
  fundMe =await ethers.getContractAt("FundMe",fundMeDeployment.address)
})
//test fund and getFund success
it("fund and getFund success",
  async function () {
    await fundMe.fund({value:ethers.parseEther("0.5")})
    //make sure window closed
    await new Promise(resolve => setTimeout(resolve,181*1000))
    //make sure we can get receipt
    const getFundTx=await fundMe.getFund()
    const getFundReceipt = await getFundTx.wait()
    expect(getFundReceipt)
    .to.emit(fundMe,"FundWithdrawByOwner")
    .withArgs(ethers.parseEther("0.5"))
  }
)


//test fund and refund succcess
it("fund and refund success",
  async function () {
    await fundMe.fund({value:ethers.parseEther("0.1")})
    //make sure window closed
    await new Promise(resolve => setTimeout(resolve,181*1000))
    //make sure we can get receipt
    const reFundTx=await fundMe.reFund()
    const reFundReceipt = await reFundTx.wait()
    expect(reFundReceipt)
    .to.emit(fundMe,"RefundByFunder")
    .withArgs(firstAccount,ethers.parseEther("0.1"))
  }
)


})