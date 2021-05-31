const { time } = require('@openzeppelin/test-helpers');
const { expect, util } = require('chai');
const hardhat = require('hardhat');
const { provider, utils } = hardhat.ethers;

describe('Staking Rewards', function () {
  beforeEach(async () => {
    accounts = await provider.listAccounts();
    owner = accounts[0];
    bob = accounts[1];
    alice = accounts[2];
    address0 = "0x0000000000000000000000000000000000000000";

    const SDCFactory = await hardhat.ethers.getContractFactory('SmartDEXChain');
    SDCReward = await SDCFactory.deploy();

    lp1 = await SDCFactory.deploy();
    lp2 = await SDCFactory.deploy();
    lp3 = await SDCFactory.deploy();
    lp4 = await SDCFactory.deploy();

    const StakingRewardsFactory = await hardhat.ethers.getContractFactory('StakingRewardsFactory');
    factory = await upgrades.deployProxy(StakingRewardsFactory, [SDCReward.address, Date.now() + 10]);
    await factory.deployed();

    await SDCReward.mint(factory.address, utils.parseUnits("800000000", 18));

    await factory.deploy(lp1.address, utils.parseUnits("200000000", 18));
    await factory.deploy(lp2.address, utils.parseUnits("200000000", 18));
    await factory.deploy(lp3.address, utils.parseUnits("200000000", 18));
    await factory.deploy(lp4.address, utils.parseUnits("200000000", 18));

    const StakingRewards = await hardhat.ethers.getContractFactory("StakingRewards");
    sr1 = await StakingRewards.attach((await factory.stakingRewardsInfoByStakingToken(lp1.address)).stakingRewards);
    sr2 = await StakingRewards.attach((await factory.stakingRewardsInfoByStakingToken(lp2.address)).stakingRewards);
    sr3 = await StakingRewards.attach((await factory.stakingRewardsInfoByStakingToken(lp3.address)).stakingRewards);
    sr4 = await StakingRewards.attach((await factory.stakingRewardsInfoByStakingToken(lp4.address)).stakingRewards);

  });

  it('First Two years', async () => {
    const [owner, bob, alice] = await hardhat.ethers.getSigners();
    await lp1.connect(owner).mint(bob.address, '2000');
    await lp2.connect(owner).mint(bob.address, '2000');
    await lp3.connect(owner).mint(bob.address, '2000');
    await lp4.connect(owner).mint(bob.address, '2000');

    await lp1.connect(owner).mint(alice.address, '2000');
    await lp2.connect(owner).mint(alice.address, '2000');
    await lp3.connect(owner).mint(alice.address, '2000');
    await lp4.connect(owner).mint(alice.address, '2000');

    await lp1.connect(bob).approve(sr1.address, '1000');
    await lp2.connect(bob).approve(sr2.address, '1000');
    await lp3.connect(bob).approve(sr3.address, '1000');
    await lp4.connect(bob).approve(sr4.address, '1000');

    await lp1.connect(alice).approve(sr1.address, '1000');
    await lp2.connect(alice).approve(sr2.address, '1000');
    await lp3.connect(alice).approve(sr3.address, '1000');
    await lp4.connect(alice).approve(sr4.address, '1000');

    // ================= First year =================
    // First month
    console.log("First year - 1st");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("12500000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("12500000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("12500000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("12500000", 18), "1");

    await sr1.connect(bob).stake("10");
    await sr2.connect(bob).stake("10");
    await sr3.connect(bob).stake("10");
    await sr4.connect(bob).stake("10");

    await sr1.connect(alice).stake("10");
    await sr2.connect(alice).stake("10");
    await sr3.connect(alice).stake("10");
    await sr4.connect(alice).stake("10");

    // Second month
    console.log("2nd");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("10000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("10000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("10000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("10000000", 18), "1");

    // Third month
    console.log("3rd");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("7500000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("7500000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("7500000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("7500000", 18), "1");

    // Fourth month
    console.log("4th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("7500000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("7500000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("7500000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("7500000", 18), "1");

    // Fifth month
    console.log("5th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("6250000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("6250000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("6250000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("6250000", 18), "1");

    // Sixth month
    console.log("6th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("6250000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("6250000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("6250000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("6250000", 18), "1");

    // Seventh month
    console.log("7th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Eighth month
    console.log("8th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Ninth month
    console.log("9th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Tenth month
    console.log("10th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Eleventh month
    console.log("11th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Twelfth month
    console.log("12th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");







    // ================= Second year =================
    // First month
    console.log("Second year - 1st");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Second month
    console.log("2nd");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Third month
    console.log("3rd");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Fourth month
    console.log("4th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Fifth month
    console.log("5th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Sixth month
    console.log("6th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Seventh month
    console.log("7th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Eighth month
    console.log("8th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Ninth month
    console.log("9th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Tenth month
    console.log("10th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Eleventh month
    console.log("11th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");

    // Twelfth month
    console.log("12th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("5000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("5000000", 18), "1");
  });








  it('Last Two years', async () => {
    const [owner, bob, alice] = await hardhat.ethers.getSigners();
    await lp1.connect(owner).mint(bob.address, '2000');
    await lp2.connect(owner).mint(bob.address, '2000');
    await lp3.connect(owner).mint(bob.address, '2000');
    await lp4.connect(owner).mint(bob.address, '2000');

    await lp1.connect(owner).mint(alice.address, '2000');
    await lp2.connect(owner).mint(alice.address, '2000');
    await lp3.connect(owner).mint(alice.address, '2000');
    await lp4.connect(owner).mint(alice.address, '2000');

    await lp1.connect(bob).approve(sr1.address, '1000');
    await lp2.connect(bob).approve(sr2.address, '1000');
    await lp3.connect(bob).approve(sr3.address, '1000');
    await lp4.connect(bob).approve(sr4.address, '1000');

    await lp1.connect(alice).approve(sr1.address, '1000');
    await lp2.connect(alice).approve(sr2.address, '1000');
    await lp3.connect(alice).approve(sr3.address, '1000');
    await lp4.connect(alice).approve(sr4.address, '1000');

    // ================= First and second year =================
    // First month
    console.log("First and second year");
    await factory.connect(owner).notifyRewardAmount(lp1.address, utils.parseUnits("140000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, utils.parseUnits("140000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, utils.parseUnits("140000000", 18), "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, utils.parseUnits("140000000", 18), "1");

    await sr1.connect(bob).stake("10");
    await sr2.connect(bob).stake("10");
    await sr3.connect(bob).stake("10");
    await sr4.connect(bob).stake("10");

    await sr1.connect(alice).stake("10");
    await sr2.connect(alice).stake("10");
    await sr3.connect(alice).stake("10");
    await sr4.connect(alice).stake("10");


    // ================= Third year =================
    // First month
    console.log("Third year - 1st");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "3333333333333333000000000", "1");

    // Second month
    console.log("2nd");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "3333333333333333000000000", "1");

    // Third month
    console.log("3rd");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "3333333333333333000000000", "1");

    // Fourth month
    console.log("4th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "3333333333333333000000000", "1");

    // Fifth month
    console.log("5th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "3333333333333333000000000", "1");

    // Sixth month
    console.log("6th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "3333333333333333000000000", "1");

    // Seventh month
    console.log("7th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "3333333333333333000000000", "1");

    // Eighth month
    console.log("8th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "3333333333333333000000000", "1");

    // Ninth month
    console.log("9th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "3333333333333333000000000", "1");

    // Tenth month
    console.log("10th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "3333333333333333000000000", "1");

    // Eleventh month
    console.log("11th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "3333333333333333000000000", "1");

    // Twelfth month
    console.log("12th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "3333333333333333000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "3333333333333333000000000", "1");










    // ================= Fourth year =================
    // First month
    console.log("Fourth year - 1st");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "1666666666666667000000000", "1");

    // Second month
    console.log("2nd");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "1666666666666667000000000", "1");

    // Third month
    console.log("3rd");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "1666666666666667000000000", "1");

    // Fourth month
    console.log("4th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "1666666666666667000000000", "1");

    // Fifth month
    console.log("5th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "1666666666666667000000000", "1");

    // Sixth month
    console.log("6th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "1666666666666667000000000", "1");

    // Seventh month
    console.log("7th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "1666666666666667000000000", "1");

    // Eighth month
    console.log("8th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "1666666666666667000000000", "1");

    // Ninth month
    console.log("9th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "1666666666666667000000000", "1");

    // Tenth month
    console.log("10th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "1666666666666667000000000", "1");

    // Eleventh month
    console.log("11th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "1666666666666667000000000", "1");

    // Twelfth month
    console.log("12th");
    await factory.connect(owner).notifyRewardAmount(lp1.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp2.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp3.address, "1666666666666667000000000", "1");
    await factory.connect(owner).notifyRewardAmount(lp4.address, "1666666666666667000000000", "1");

    // Unstake
    console.log("Unstake")
    expect(await SDCReward.balanceOf(sr1.address)).to.equal(utils.parseUnits("200000000", 18));
    expect(await SDCReward.balanceOf(sr2.address)).to.equal(utils.parseUnits("200000000", 18));
    expect(await SDCReward.balanceOf(sr3.address)).to.equal(utils.parseUnits("200000000", 18));
    expect(await SDCReward.balanceOf(sr4.address)).to.equal(utils.parseUnits("200000000", 18));
    time.advanceBlock();
    expect(await sr1.earned(bob.address)).to.equal(utils.parseUnits("100000000", 18));
    expect(await sr2.earned(bob.address)).to.equal(utils.parseUnits("100000000", 18));
    expect(await sr3.earned(bob.address)).to.equal(utils.parseUnits("100000000", 18));
    expect(await sr4.earned(bob.address)).to.equal(utils.parseUnits("100000000", 18));

    expect(await sr1.earned(alice.address)).to.equal(utils.parseUnits("100000000", 18));
    expect(await sr2.earned(alice.address)).to.equal(utils.parseUnits("100000000", 18));
    expect(await sr3.earned(alice.address)).to.equal(utils.parseUnits("100000000", 18));
    expect(await sr4.earned(alice.address)).to.equal(utils.parseUnits("100000000", 18));

    await sr1.connect(bob).withdraw("10");
    await sr2.connect(bob).withdraw("10");
    await sr3.connect(bob).withdraw("10");
    await sr4.connect(bob).withdraw("10");

    await sr1.connect(alice).withdraw("10");
    await sr2.connect(alice).withdraw("10");
    await sr3.connect(alice).withdraw("10");
    await sr4.connect(alice).withdraw("10");

    expect(await SDCReward.balanceOf(sr1.address)).to.equal("0");
    expect(await SDCReward.balanceOf(sr2.address)).to.equal("0");
    expect(await SDCReward.balanceOf(sr3.address)).to.equal("0");
    expect(await SDCReward.balanceOf(sr4.address)).to.equal("0");

    expect(await SDCReward.balanceOf(factory.address)).to.equal("0");

    expect(await SDCReward.balanceOf(bob.address)).to.equal(utils.parseUnits("400000000", 18));
    expect(await SDCReward.balanceOf(alice.address)).to.equal(utils.parseUnits("400000000", 18));
  });

  return;
});