import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "FakeUSD" using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployFakeUSD: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("FakeUSD", {
    from: deployer,
    // Contract constructor arguments (none for FakeUSD)
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const fakeUSD = await hre.ethers.getContract<Contract>("FakeUSD", deployer);
  console.log("🚀 FakeUSD deployed at:", fakeUSD.address);
  console.log("💰 Initial total supply:", await fakeUSD.totalSupply());

  // Mint 1000 tokens for the deployer
  try {
    const mintTx = await fakeUSD.mint();
    await mintTx.wait();
    console.log("🎉 Minted 1000 FUSD for the deployer");
  } catch (error) {
    console.log("❌ Failed to mint tokens for the deployer. They might have already minted.");
  }

  console.log("💼 Deployer balance:", await fakeUSD.balanceOf(deployer));
  console.log("🏦 Updated total supply:", await fakeUSD.totalSupply());
};

export default deployFakeUSD;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags FakeUSD
deployFakeUSD.tags = ["FakeUSD"];
