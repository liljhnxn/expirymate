import hre from "hardhat";

const { ethers } = hre;

async function main() {
  const contractAddress = "0xbDcBdb48271D430f3051bABA75934fB928A61171";
  const ExpiryMate = await ethers.getContractFactory("ExpiryMate");
  const contract = ExpiryMate.attach(contractAddress);

  const [deployer] = await ethers.getSigners();
  console.log("Checking BOT Chain for deployer:", deployer.address);

  const count = await contract.getRecordCount(deployer.address);
  console.log("Record count for deployer:", count.toString());

  const myRecords = await contract.getMyRecords();
  console.log("getMyRecords() result:", myRecords);
}

main().catch(console.error);
