import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

const { ethers } = hre;

async function main() {
  console.log("-----------------------------------------");
  console.log("Deploying ExpiryMate smart contract to Botchain Testnet...");
  console.log("-----------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer found. Please check PRIVATE_KEY in .env");
  }

  console.log("Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "BOHR");

  if (balance === BigInt(0)) {
    console.warn("WARNING: Deployer account balance is 0 BOHR! Transaction may fail if gas cannot be paid.");
  }

  console.log("Submitting contract deployment transaction...");
  const ExpiryMateFactory = await ethers.getContractFactory("ExpiryMate");
  const expiryMate = await ExpiryMateFactory.deploy();

  console.log("Waiting for block confirmation...");
  await expiryMate.waitForDeployment();
  const contractAddress = await expiryMate.getAddress();

  console.log("\n=========================================");
  console.log("ExpiryMate successfully deployed to:", contractAddress);
  console.log("Explorer URL:", `https://scan.bohr.life/address/${contractAddress}`);
  console.log("=========================================\n");

  // Save to src/config/deployment.json
  const configDir = path.join(process.cwd(), "src/config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const deploymentData = {
    contractAddress,
    network: "botchainTestnet",
    chainId: 968,
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
      fs.writeFileSync(envPath, content);
      console.log(`Updated ${file} with contract address.`);
    }
  }

  // Verification step
  console.log("\nAttempting contract verification on explorer...");
  try {
    console.log("Waiting 10 seconds for explorer to index the contract...");
    await new Promise((resolve) => setTimeout(resolve, 10000));

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("Contract verified successfully!");
  } catch (verifyErr: unknown) {
    const msg = verifyErr instanceof Error ? verifyErr.message : String(verifyErr);
    console.log("Verification notice:", msg);
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
