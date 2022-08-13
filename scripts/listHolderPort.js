const { ethers } = require("hardhat");
const treasury_JSON = require("../artifacts/contracts/DualTreasuryDefi.sol/DualTreasuryDefi.json");
const xtoken_JSON = require("../artifacts/contracts/TreasuryToken.sol/TreasuryToken.json");


const wethTokenAbi = [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "guy", type: "address" },
        { name: "wad", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "src", type: "address" },
        { name: "dst", type: "address" },
        { name: "wad", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "wad", type: "uint256" }],
      name: "withdraw",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "dst", type: "address" },
        { name: "wad", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "deposit",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { name: "", type: "address" },
        { name: "", type: "address" },
      ],
      name: "allowance",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    { payable: true, stateMutability: "payable", type: "fallback" },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "src", type: "address" },
        { indexed: true, name: "guy", type: "address" },
        { indexed: false, name: "wad", type: "uint256" },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "src", type: "address" },
        { indexed: true, name: "dst", type: "address" },
        { indexed: false, name: "wad", type: "uint256" },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "dst", type: "address" },
        { indexed: false, name: "wad", type: "uint256" },
      ],
      name: "Deposit",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "src", type: "address" },
        { indexed: false, name: "wad", type: "uint256" },
      ],
      name: "Withdrawal",
      type: "event",
    },
  ];
const daiTokenAbi = [
    {
      inputs: [{ internalType: "uint256", name: "chainId_", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "src",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "guy",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "wad",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: true,
      inputs: [
        { indexed: true, internalType: "bytes4", name: "sig", type: "bytes4" },
        {
          indexed: true,
          internalType: "address",
          name: "usr",
          type: "address",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "arg1",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "arg2",
          type: "bytes32",
        },
        { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
      ],
      name: "LogNote",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "src",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "dst",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "wad",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      constant: true,
      inputs: [],
      name: "DOMAIN_SEPARATOR",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "PERMIT_TYPEHASH",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "address", name: "", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "usr", type: "address" },
        { internalType: "uint256", name: "wad", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "usr", type: "address" },
        { internalType: "uint256", name: "wad", type: "uint256" },
      ],
      name: "burn",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "guy", type: "address" }],
      name: "deny",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "usr", type: "address" },
        { internalType: "uint256", name: "wad", type: "uint256" },
      ],
      name: "mint",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "src", type: "address" },
        { internalType: "address", name: "dst", type: "address" },
        { internalType: "uint256", name: "wad", type: "uint256" },
      ],
      name: "move",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "nonces",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "holder", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "nonce", type: "uint256" },
        { internalType: "uint256", name: "expiry", type: "uint256" },
        { internalType: "bool", name: "allowed", type: "bool" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "permit",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "usr", type: "address" },
        { internalType: "uint256", name: "wad", type: "uint256" },
      ],
      name: "pull",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "usr", type: "address" },
        { internalType: "uint256", name: "wad", type: "uint256" },
      ],
      name: "push",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "guy", type: "address" }],
      name: "rely",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "dst", type: "address" },
        { internalType: "uint256", name: "wad", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "src", type: "address" },
        { internalType: "address", name: "dst", type: "address" },
        { internalType: "uint256", name: "wad", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "version",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "wards",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];

  const api_id = process.env.RINKEBY_ID; //process.env.INFURA_KOVAN_ID
const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);


const contract_address = process.env.TREASURY_RINKEBY_CONTRACT_ADDRESS; //process.env.TREASURY_KOVAN_CONTRACT_ADDRESS
const weth_address = process.env.WETH_RINKEBY_ADDRESS; //process.env.WETH_KOVAN_ADDRESS
const dai_address = process.env.DAI_RINKEBY_ADDRESS; //process.env.DAI_KOVAN_ADDRESS
const xtoken_address = process.env.XTOKEN_RINKEBY_ADDRESS;

async function main() {

  const abi = treasury_JSON.abi;
  const xtoken_abi=xtoken_JSON.abi

  const provider = new ethers.providers.AlchemyProvider("rinkeby", api_id);

  const x_treasury = new ethers.Contract(contract_address, abi, provider);
  const listHolder = await x_treasury.listAllTokenHolder();

  console.log("Port in Defi-Farm")
  for (const holder_address of listHolder) {
    const reward = await x_treasury.getInvestorRewardToken(holder_address);
    const weth = await x_treasury.getInvestorWETH(holder_address);
    const dai = await x_treasury.getInvestorDAI(holder_address);
    console.log(
      holder_address +
        " - Mo2Jo=" +
        fromWei(reward) +
        " - WETH=" +
        fromWei(weth) +
        " - DAI=" +
        fromWei(dai)
    );
  }
  console.log("================================================================================")

  const x_xtoken=new ethers.Contract(xtoken_address,xtoken_abi,provider)
  const x_weth = new ethers.Contract(weth_address, wethTokenAbi, provider);
  const x_dai = new ethers.Contract(dai_address, daiTokenAbi, provider);
  console.log("Port in Wallet")
  for (const holder_address of listHolder) {
    const reward = await x_xtoken.balanceOf(holder_address);
    const weth = await x_weth.balanceOf(holder_address)
    const dai = await x_dai.balanceOf(holder_address)
    console.log(
      holder_address +
        " - Mo2Jo=" +
        fromWei(reward) +
        " - WETH=" +
        fromWei(weth) +
        " - DAI=" +
        fromWei(dai)
    );
  }

  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
