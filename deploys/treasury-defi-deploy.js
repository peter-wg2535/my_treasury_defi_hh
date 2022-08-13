
const hre = require("hardhat");
const { run } = require("hardhat")
//https://rinkeby.etherscan.io/address/0xD53f675D9aa2BeF2E7bF9E076FfB6f6e65273eEf#code
//https://keepers.chain.link/rinkeby/6887393915718815021757119704356588867114508970171361986648523096377625952749
async function main() {

  const chain_network='rinkeby'
  const is_verified=true

  const no_token_supply=1000000
  const no_token_dist=1
  const every_xxx=15
  const every_second=every_xxx*60
  const max_counter_dist=10

  // const Treasury = await hre.ethers.getContractFactory("DualTreasuryDefi");
  // const treasury = await Treasury.deploy(no_token_supply,no_token_dist
  //   ,process.env.WETH_RINKEBY_ADDRESS,process.env.DAI_RINKEBY_ADDRESS
  //   ,process.env.RINKEBY_ETHUSD_AGG_PRICE_ADDRESS
  //   ,every_second,max_counter_dist);
  // await treasury.deployed();
  // console.log("Treasury deployed to :"+chain_network+" : " +treasury.address);


  //npx hardhat verify --network  rinkeby 0x83e3F674a22EFA1E995b85Ef4199b754c5b90E03 1000000 1 0xc778417E063141139Fce010982780140Aa0cD5Ab 0x4aAded56bd7c69861E8654719195fCA9C670EB45 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e  900
  constructor_args=[
    no_token_supply,
    no_token_dist,
    process.env.WETH_RINKEBY_ADDRESS,
    process.env.DAI_RINKEBY_ADDRESS,
    process.env.RINKEBY_ETHUSD_AGG_PRICE_ADDRESS,
    every_second,
    max_counter_dist
  ]
               //treasury.address
  await verify(process.env.TREASURY_RINKEBY_CONTRACT_ADDRESS,constructor_args)
}
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
