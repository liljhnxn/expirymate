import hre from "hardhat";

const { ethers } = hre;

async function main() {
  console.log("=========================================");
  console.log("Checking Botchain Mainnet (Chain ID 677)...");
  console.log("=========================================");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer found. Please check PRIVATE_KEY in .env");
  }

  console.log("Deployer Address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer Balance:", ethers.formatEther(balance), "BOT");

  const feeData = await ethers.provider.getFeeData();
  console.log("Current Gas Price:", feeData.gasPrice ? `${ethers.formatUnits(feeData.gasPrice, "gwei")} gwei` : "N/A");

  const ExpiryMateFactory = await ethers.getContractFactory("ExpiryMate");
  const deployTx = await ExpiryMateFactory.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTx);
  console.log("Estimated Gas Units for Deployment:", estimatedGas.toString());

  const gasPriceToUse = feeData.gasPrice || 1000000000n; // fallback to 1 gwei
  const totalCostWei = estimatedGas * gasPriceToUse;
  console.log("Estimated Deployment Cost:", ethers.formatEther(totalCostWei), "BOT");

  if (balance < totalCostWei) {
    console.error("❌ INSUFFICIENT BALANCE to deploy contract on Mainnet.");
    console.error(`Required: ~${ethers.formatEther(totalCostWei)} BOT, Available: ${ethers.formatEther(balance)} BOT`);
  } else {
    console.log("✅ Sufficient balance for deployment! Cost is very low.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

