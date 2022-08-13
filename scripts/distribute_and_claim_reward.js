const { ethers} = require("hardhat")
const  treasury_JSON=require("../artifacts/contracts/DualTreasuryDefi.sol/DualTreasuryDefi.json")
const abi = treasury_JSON.abi

const x_api_id=process.env.RINKEBY_ID
const treasury_contract_address=process.env.TREASURY_RINKEBY_CONTRACT_ADDRESS


const option=2 //1=dist 2=claim 
const amount_x = 0  // amount to claim  claim all=0
let reward_amount=ethers.utils.parseEther(amount_x.toString())
const acc=process.env.PRIVATE_KEY2

const provider = new ethers.providers.AlchemyProvider("rinkeby", x_api_id)
const acc_for_claim =new ethers.Wallet(acc, provider) 
const x_treasury = new ethers.Contract(treasury_contract_address, abi, provider)

async function main() {
    try {
     if(option==1){
        console.log("Distribute by Owner")
        const owner =new ethers.Wallet(process.env.PRIVATE_KEY, provider)
        console.log("Owner Wallet :"+owner.address)
        const txDistReward=await x_treasury.connect(owner).distributeRewardTokensByOwner()
        txReceipt=await txDistReward.wait() 
        // console.log(txReceipt)
     }
     else if(option==2){
      console.log("User Wallet  to claim reward:"+acc_for_claim.address) 
      let txClaim 
      if (amount_x==0) // claim all
        reward_amount= await x_treasury.getInvestorRewardToken(acc_for_claim.address); 
      
      console.log("Amount to claim : "+reward_amount) 

      if (reward_amount>0  ){
       txClaim =await x_treasury.connect(acc_for_claim).claimRewardToken(reward_amount)
       txReceipt=await txClaim.wait() 
      }
      else{
        console.log("no amount to claim") 

      }
     }
     
      
    } catch (error) {
        console.log(error.toString())
    }
    

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  

