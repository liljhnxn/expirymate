import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

const { ethers } = hre;

async function main() {
  console.log("-----------------------------------------");
  console.log("Deploying ExpiryMate to Botchain Mainnet (Chain ID 677)...");
  console.log("-----------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer found. Please check PRIVATE_KEY in .env");
  }

  console.log("Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "BOT");

  if (balance === BigInt(0)) {
    throw new Error("Deployer account has 0 BOT balance. Please fund the wallet before deploying to Mainnet.");
  }

  // Query gas price to keep fees as low as possible
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || 1000000000n; // default 1 gwei if not returned
  console.log("Using Gas Price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");

  const ExpiryMateFactory = await ethers.getContractFactory("ExpiryMate");

  // Estimate gas
  const deployTx = await ExpiryMateFactory.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTx);
  console.log("Estimated Gas Units:", estimatedGas.toString());
  console.log("Estimated Deployment Cost:", ethers.formatEther(estimatedGas * gasPrice), "BOT");

  console.log("Submitting contract deployment with optimal gas parameters...");
  const expiryMate = await ExpiryMateFactory.deploy({
    gasPrice: gasPrice,
  });

  console.log("Waiting for block confirmation on Mainnet...");
  await expiryMate.waitForDeployment();
  const contractAddress = await expiryMate.getAddress();

  console.log("\n=========================================");
  console.log("🎉 ExpiryMate successfully deployed to Botchain Mainnet!");
  console.log("Contract Address:", contractAddress);
  console.log("Explorer URL:", `https://scan.botchain.ai/address/${contractAddress}`);
  console.log("=========================================\n");

  // Save to src/config/deployment.json
  const configDir = path.join(process.cwd(), "src/config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const deploymentData = {
    contractAddress,
    network: "botchainMainnet",
    chainId: 677,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  fs.writeFileSync(
    path.join(configDir, "deployment.json"),
    JSON.stringify(deploymentData, null, 2)
  );
  console.log("Deployment information saved to src/config/deployment.json");

  // Update .env and .env.local
  const envFiles = [".env", ".env.local"];
  for (const file of envFiles) {
    const envPath = path.join(process.cwd(), file);
    if (fs.existsSync(envPath)) {
      let content = fs.readFileSync(envPath, "utf-8");
      if (content.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
        content = content.replace(
          /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/g,
          `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
        );
      } else {
        content += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
      }
      // Update chain ID and RPC in env as well
      content = content.replace(/NEXT_PUBLIC_CHAIN_ID=.*/g, `NEXT_PUBLIC_CHAIN_ID=677`);
      content = content.replace(/NEXT_PUBLIC_RPC_URL=.*/g, `NEXT_PUBLIC_RPC_URL=https://rpc.botchain.ai`);
      content = content.replace(/NEXT_PUBLIC_EXPLORER_URL=.*/g, `NEXT_PUBLIC_EXPLORER_URL=https://scan.botchain.ai`);

      fs.writeFileSync(envPath, content);
      console.log(`Updated ${file} with Mainnet configuration.`);
    }
  }

  // Verification step
  console.log("\nAttempting contract verification on BotchainScan...");
  try {
    console.log("Waiting 10 seconds for explorer to index the contract...");
    await new Promise((resolve) => setTimeout(resolve, 10000));

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("Contract verified successfully on Mainnet!");
  } catch (verifyErr: unknown) {
    const msg = verifyErr instanceof Error ? verifyErr.message : String(verifyErr);
    console.log("Verification notice:", msg);
  }
}

main().catch((error) => {
  console.error("Mainnet deployment failed:", error);
  process.exitCode = 1;
});

