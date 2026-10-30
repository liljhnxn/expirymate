import hre from "hardhat";

const { ethers } = hre;

async function main() {
  const contractAddress = "0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2";
  const ExpiryMate = await ethers.getContractFactory("ExpiryMate");
  const contract = ExpiryMate.attach(contractAddress);

  const [deployer] = await ethers.getSigners();
  console.log("Checking for deployer:", deployer.address);

  const count = await contract.getRecordCount(deployer.address);
  console.log("Record count for deployer:", count.toString());

  const myRecords = await contract.getMyRecords();
  console.log("getMyRecords() result:", myRecords);

  try {
    const rec0 = await contract.getRecord(0);
    console.log("Record 0:", rec0);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log("Record 0 query error:", msg);
  }
}

main().catch(console.error);

