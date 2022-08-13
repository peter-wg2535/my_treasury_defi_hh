const { ethers } = require("hardhat");
const treasury_JSON = require("../artifacts/contracts/DualTreasuryDefi.sol/DualTreasuryDefi.json");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

const api_id = process.env.RINKEBY_ID; //process.env.INFURA_KOVAN_ID
const contract_address = process.env.TREASURY_RINKEBY_CONTRACT_ADDRESS; //process.env.TREASURY_KOVAN_CONTRACT_ADDRESS
const weth_address = process.env.WETH_RINKEBY_ADDRESS; //process.env.WETH_KOVAN_ADDRESS
const dai_address = process.env.DAI_RINKEBY_ADDRESS; //process.env.DAI_KOVAN_ADDRESS
async function main() {
  const abi = treasury_JSON.abi;
  const provider = new ethers.providers.AlchemyProvider("rinkeby", api_id);
  const accout = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const x_treasury = new ethers.Contract(contract_address, abi, provider);
  
  const x=await x_treasury.getNoTokenDistToHolderEachTime()
  console.log(x)
  
 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
