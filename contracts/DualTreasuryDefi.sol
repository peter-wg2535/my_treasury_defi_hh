// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "./TreasuryToken.sol";

import "hardhat/console.sol";

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
contract DualTreasuryDefi  is KeeperCompatibleInterface {
// contract DualTreasuryDefi  {
    uint256 private  i_interval;  // interval on second basis  
    uint256 private s_lastTimeStamp;

    address[] public tokenHolders;
    address payable public owner;

    uint256 private no_token_dist_to_holder;

    address public wethAddress;
    IERC20 private weth;
    mapping(address => uint) public wethBalances;

    address public daiAddress;
    IERC20 private dai;
    mapping(address => uint) public daiBalances;

    // Treasury Token
    IERC20 public token;
    mapping(address => uint) public rewardTokenBalances;

    // Network: rinkeby ,Aggregator: ETH/USD
    AggregatorV3Interface internal priceFeed;
    int public ethPriceInUSD = 0;

    uint public counter;
    uint public s_max_counter=0;

    event DistributeReward(
        address indexed _xtoken,
        uint _allWethBal,
        uint _allDaiBal,
        uint _allDaiToETHBal,
        uint _remainingReward,
        uint256 _distributedReward
    );

    constructor(
        uint256 _rewardTokenSupply,
        uint256 _no_token_dist,
        address _wethAddress,
        address _daiAddress,
        address _aggETHUSDPriceAddress,
        uint256 _interval,
        uint256 _no_max_dist
    ) {
        owner = payable(msg.sender);

        //Ex.1000000
        token = new TreasuryToken(_rewardTokenSupply);
        // Ex. 10 ,100,1000
        no_token_dist_to_holder =  _no_token_dist *( 10 ** 18) ;
    
        //Ex.0xc778417E063141139Fce010982780140Aa0cD5Ab  WETH-Rinkeby
        weth = IERC20(_wethAddress);

        //Ex. 0x4aAded56bd7c69861E8654719195fCA9C670EB45 DAI-Rinkeby
        dai = IERC20(_daiAddress);

        // Ex. https://docs.chain.link/docs/ethereum-addresses/#Rinkeby%20Testnet
        //ETH/USD	0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        priceFeed = AggregatorV3Interface(_aggETHUSDPriceAddress);

        i_interval = _interval;
        s_lastTimeStamp = block.timestamp;


        counter = 0;
        if (_no_max_dist==0)
             s_max_counter=_rewardTokenSupply/_no_token_dist;
        else
            s_max_counter=_no_max_dist;
    }

    function addNewHolder(address _holder) public {
        bool isNew = true;
        for (uint i = 0; i < tokenHolders.length; i++) {
            if (_holder == tokenHolders[i]) {
                isNew = false;
                break;
            }
        }
        if (isNew == true) {
            tokenHolders.push(_holder);
        }
    }

    // deposit WETH into the treasury
    function depositWeth(uint _amount)
        external
        payable
        depositGreaterThanZero(_amount)
    {
        // update depositor's treasury WETH balance
        // update state before transfer of funds to prevent reentrancy attacks
        addNewHolder(msg.sender);

        wethBalances[msg.sender] += _amount;

        // deposit WETH into treasury
        uint256 allowance = weth.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check the token allowance");
        weth.transferFrom(msg.sender, address(this), _amount);
    }

    // deposit DAI into the treasury
    function depositDai(uint _amount)
        external
        payable
        depositGreaterThanZero(_amount)
    {
        // update depositor's treasury DAI balance
        // update state before transfer of funds to prevent reentrancy attacks
        addNewHolder(msg.sender);

        daiBalances[msg.sender] += _amount;

        // deposit DAI into treasury
        uint256 allowance = dai.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check the token allowance");
        dai.transferFrom(msg.sender, address(this), _amount);
    }

    function withdrawWeth(uint _amount) external payable {
        require(
            _amount <= wethBalances[msg.sender],
            "Withdraw WETH amount must be less than or equal Balance"
        );
        wethBalances[msg.sender] -= _amount;
        weth.transfer(msg.sender, _amount);
    }

    function withdrawDai(uint _amount) external payable {
        require(
            _amount <= daiBalances[msg.sender],
            "Withdraw DAI amount must be less than or equal Balance"
        );
        daiBalances[msg.sender] -= _amount;
        dai.transfer(msg.sender, _amount);
    }

    function listAllTokenHolder() public view returns (address[] memory) {
        return tokenHolders;
    }

    function getWethBalance() public view returns (uint) {
        return weth.balanceOf(address(this));
    }

    function getDaiBalance() public view returns (uint) {
        return dai.balanceOf(address(this));
    }

    function getTokenBalance() public view returns (uint) {
        return token.balanceOf(address(this));
    }

    function getInvestorRewardToken(address _holder) public view returns (uint) {
        return rewardTokenBalances[_holder];
    }

    function getInvestorWETH(address _holder) public view returns (uint) {
        //return wethBalances[msg.sender];
        return wethBalances[_holder];
    }

    function getInvestorDAI(address _holder) public view returns (uint) {
        //return daiBalances[msg.sender];
        return daiBalances[_holder];
    }

    function getLatestETHPrice() public view returns (int) {
        return ethPriceInUSD;
    }
    function checkUpkeep(bytes memory /* checkData */) public view override returns (bool upkeepNeeded,bytes memory /* performData */)
    {
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool remainingRewardToken = getTokenBalance() >= no_token_dist_to_holder;
        bool poolBal=  (getWethBalance()>0) || (getDaiBalance()>0);
        bool isNotOverMax= (counter<=s_max_counter);  

        upkeepNeeded = (timePassed && remainingRewardToken && poolBal && isNotOverMax);
        //upkeepNeeded = (timePassed && remainingRewardToken && poolBal);
        return (upkeepNeeded, "0x0"); // can we comment this out?
    }
    //function distributeRewardTokensByChainlinkKeeper
    function performUpkeep(bytes calldata /* performData */ ) external override {

        (bool upkeepNeeded, ) = checkUpkeep("");
        // require(upkeepNeeded, "Upkeep not needed");
        if (upkeepNeeded) {
            distributeReawardTokens();
             counter=counter+1;
             s_lastTimeStamp=block.timestamp;
        }

    }
    function distributeRewardTokensByOwner() public onlyOwner {
        distributeReawardTokens();
    }
    function distributeReawardTokens() private {    

        setLatestETHPrice();

        require(
            ethPriceInUSD > 0,
            "We must have the current Eth price to calculate invetor pool share. PlLease call 'getLatestPrice()'."
        );

        uint treasuryTokenBalance = getTokenBalance();
        require(
            treasuryTokenBalance >= no_token_dist_to_holder,
            "Token reward ran out"
        );

        // 1-Find out Total item in Pool
        // get pool WETH balance
        uint poolWethBal = getWethBalance();
        // get pool DAI balance and convert to ETH
        uint poolDaiBal = getDaiBalance();        
        require( (poolWethBal >0 || poolWethBal>0),"No amount in both WETH and DAI Pool");


        uint poolDaiBalToEth = poolDaiBal / uint(ethPriceInUSD);
        // add pool weth & dai (ETH val)
        uint poolBalance = poolWethBal + poolDaiBalToEth;

        // 2-Find out Total item  of investor and dist

        for (uint i = 0; i < tokenHolders.length; i++) {
            address holder = tokenHolders[i];
            // get investor WETH balance
            uint investorWethBal = wethBalances[holder];
            // get investor DAI balance ..convert to ETH
            uint investorDaiBalToEth = daiBalances[holder] / uint(ethPriceInUSD);
            // add investor weth & dai (ETH val)
            uint investorBalance = investorWethBal + investorDaiBalToEth;

            // pool balance / investor balance = percent of total
            uint investorPercent = (investorBalance * 100) / poolBalance;

            if (investorPercent > 0) {
                uint investorTokenShare = (no_token_dist_to_holder *investorPercent);

                rewardTokenBalances[holder] +=investorTokenShare;

                uint remaining_treasuryTokenBalance = getTokenBalance();

                emit DistributeReward(
                    address(token),
                    poolWethBal,
                    poolDaiBal,
                    poolDaiBalToEth,
                    remaining_treasuryTokenBalance,
                    no_token_dist_to_holder
                );
            }
        }
    }
    function claimRewardToken(uint _rewardAmount) public{
        require(rewardTokenBalances[msg.sender]>=_rewardAmount,"Your amount of reward must be more than or equal current balances");
        rewardTokenBalances[msg.sender]=rewardTokenBalances[msg.sender]-_rewardAmount;
        token.transfer(msg.sender, _rewardAmount);
    }
    /**
     * Returns the latest price
     */
    function setLatestETHPrice() public {
        (
            uint80 roundId,
            int256 price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        ethPriceInUSD = price;
    }

    function getNoTokenDistToHolderEachTime() public view returns (uint256) {
        return no_token_dist_to_holder;
    }

    function setNoTokenDistToHolderEachTime(uint256 new_no_token)
        public
        onlyOwner
    {
        no_token_dist_to_holder = new_no_token;
    }

    function setSecondIntervalForKeeper(uint256 _interval)
        public
        onlyOwner
    {
        i_interval=_interval;
    }

    function getSecondIntervalForKeeper() public view returns (uint256)
    {
        return i_interval;
    }
    // function setNoMaxCountToDist(uint256 _no_max_dist)
    //     public
    //     onlyOwner
    // {
    //    s_max_counter=_no_max_dist;
    // }

     function getNoMaxCountToDist() public view returns (uint256)
    {
        return i_interval;
    }
     function  getLastTimeStamp()  public view returns (uint256) {
       return s_lastTimeStamp;
     }
    


    modifier depositGreaterThanZero(uint _amount) {
        require(_amount > 0, "Deposit amount must be greater than zero");
        _;
    }
    modifier onlyOwner() {
        //is the message sender owner of the contract?
        require(msg.sender == owner);
        _;
    }

    receive() external payable {}
}
