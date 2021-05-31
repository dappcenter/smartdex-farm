// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./libs/Initializable.sol";
import "./libs/Ownable.sol";
import "./StakingRewards.sol";

contract StakingRewardsFactory is Ownable, Initializable {
    using SafeMath for uint256;

    // immutables
    address public rewardsToken;
    uint public stakingRewardsGenesis;

    // the staking tokens for which the rewards contract has been deployed
    address[] public stakingTokens;

    // info about rewards for a particular staking token
    struct StakingRewardsInfo {
        address stakingRewards;
        uint256 rewardAmount;
        uint256 notifiedRewardAmount;
    }

    // rewards info by staking token
    mapping(address => StakingRewardsInfo) public stakingRewardsInfoByStakingToken;

    function initialize(address _rewardsToken, uint256 _stakingRewardsGenesis) external initializer {
        owner = msg.sender;

        require(_stakingRewardsGenesis >= block.timestamp, 'StakingRewardsFactory::constructor: genesis too soon');

        rewardsToken = _rewardsToken;
        stakingRewardsGenesis = _stakingRewardsGenesis;
    }

    ///// permissioned functions

    // deploy a staking reward contract for the staking token, and store the reward amount
    // the reward will be distributed to the staking reward contract no sooner than the genesis
    function deploy(address stakingToken, uint256 rewardAmount) public onlyOwner {
        StakingRewardsInfo storage info = stakingRewardsInfoByStakingToken[stakingToken];
        require(info.stakingRewards == address(0), 'StakingRewardsFactory::deploy: already deployed');

        info.stakingRewards = address(new StakingRewards(/*_rewardsDistribution=*/ address(this), rewardsToken, stakingToken));
        info.rewardAmount = rewardAmount;
        info.notifiedRewardAmount = 0;
        stakingTokens.push(stakingToken);
        emit PoolDeployed(info.stakingRewards, stakingToken, rewardAmount);
    }

    ///// permissionless functions
    // notify reward amount for an individual staking token.
    // this is a fallback in case the notifyRewardAmounts costs too much gas to call for all contracts
    function notifyRewardAmount(address stakingToken, uint256 amount, uint256 duration) public onlyOwner {
        require(block.timestamp >= stakingRewardsGenesis, 'StakingRewardsFactory::notifyRewardAmount: not ready');

        StakingRewardsInfo storage info = stakingRewardsInfoByStakingToken[stakingToken];
        require(info.stakingRewards != address(0), 'StakingRewardsFactory::notifyRewardAmount: not deployed');
        require(amount <= info.rewardAmount, "StakingRewardsFactory::notifyRewardAmount: invalid notifying amount");
        require(duration > 0, "StakingRewardsFactory::notifyRewardAmount: invalid duration");

        info.rewardAmount = info.rewardAmount.sub(amount);
        info.notifiedRewardAmount = info.notifiedRewardAmount.add(amount);
        require(
            IERC20(rewardsToken).transfer(info.stakingRewards, amount),
            'StakingRewardsFactory::notifyRewardAmount: transfer failed'
        );
        StakingRewards(info.stakingRewards).notifyRewardAmount(amount, duration);
        emit NotifyRewardAmount(info.stakingRewards, stakingToken, amount, duration);
    }

    function raiseReward(address stakingToken, uint256 amount) public onlyOwner {
        StakingRewardsInfo storage info = stakingRewardsInfoByStakingToken[stakingToken];
        require(info.stakingRewards != address(0), 'StakingRewardsFactory::raiseReward: not deployed');
        require(amount > 0, "StakingRewardsFactory::raiseReward: cannot raise 0");
        info.rewardAmount = info.rewardAmount.add(amount);
        require(
            IERC20(rewardsToken).transferFrom(msg.sender, address(this), amount),
            'StakingRewardsFactory::raiseReward: transfer failed'
        );
        emit RaiseReward(info.stakingRewards, stakingToken, amount);
    }

    function emergencyWithdraw(address token, address to) public onlyOwner {
      uint256 amount = IERC20(token).balanceOf(address(this));
      require(amount > 0, "nothing to withdraw");
      require(
          IERC20(token).transfer(to, amount),
          'StakingRewardsFactory::emergencyWithdraw: transfer failed'
      );
      emit EmergencyWithdraw(token, to);
    }

    /* ========== EVENTS ========== */

    event PoolDeployed(address stakingAddress, address stakingToken, uint256 rewardAmount);
    event NotifyRewardAmount(address stakingAddress, address stakingToken, uint256 amount, uint256 duration);
    event RaiseReward(address stakingAddress, address stakingToken, uint256 raiseAmount);
    event EmergencyWithdraw(address token, address receiver);
}