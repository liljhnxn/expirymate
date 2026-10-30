import { expect } from "chai";
import hre from "hardhat";
import { ExpiryMate } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const { ethers } = hre;

describe("ExpiryMate Contract", function () {
  let expiryMate: ExpiryMate;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const ExpiryMateFactory = await ethers.getContractFactory("ExpiryMate");
    expiryMate = (await ExpiryMateFactory.deploy()) as ExpiryMate;
    await expiryMate.waitForDeployment();
  });

  describe("addRecord", function () {
    it("should allow a user to add a record with a future expiry date", async function () {
      const currentTime = await time.latest();
      const futureExpiry = currentTime + 86400 * 30; // 30 days later

      const tx = await expiryMate.connect(user1).addRecord("Passport", futureExpiry);
      await expect(tx)
        .to.emit(expiryMate, "RecordAdded")
        .withArgs(0, user1.address, "Passport", futureExpiry, (await time.latest()));

      const count = await expiryMate.getRecordCount(user1.address);
      expect(count).to.equal(1n);

      const records = await expiryMate.connect(user1).getMyRecords();
      expect(records.length).to.equal(1);
      expect(records[0].name).to.equal("Passport");
      expect(records[0].expiryDate).to.equal(BigInt(futureExpiry));
      expect(records[0].owner).to.equal(user1.address);
      expect(records[0].isDeleted).to.be.false;
    });

    it("should reject adding a record with an empty name", async function () {
      const currentTime = await time.latest();
      const futureExpiry = currentTime + 86400;

      await expect(
        expiryMate.connect(user1).addRecord("", futureExpiry)
      ).to.be.revertedWith("Item name cannot be empty");
    });

    it("should reject adding a record with an expiry date in the past or present", async function () {
      const currentTime = await time.latest();
      await expect(
        expiryMate.connect(user1).addRecord("Gym Membership", currentTime - 10)
      ).to.be.revertedWith("Expiry date must be in the future");

      await expect(
        expiryMate.connect(user1).addRecord("Gym Membership", currentTime)
      ).to.be.revertedWith("Expiry date must be in the future");
    });
  });

  describe("getMyRecords and getRecordCount", function () {
    it("should only return records for the calling wallet", async function () {
      const currentTime = await time.latest();
      await expiryMate.connect(user1).addRecord("User1 Item A", currentTime + 1000);
      await expiryMate.connect(user1).addRecord("User1 Item B", currentTime + 2000);
      await expiryMate.connect(user2).addRecord("User2 Item A", currentTime + 3000);

      const user1Records = await expiryMate.connect(user1).getMyRecords();
      expect(user1Records.length).to.equal(2);
      expect(user1Records[0].name).to.equal("User1 Item A");
      expect(user1Records[1].name).to.equal("User1 Item B");

      const user2Records = await expiryMate.connect(user2).getMyRecords();
      expect(user2Records.length).to.equal(1);
      expect(user2Records[0].name).to.equal("User2 Item A");

      expect(await expiryMate.getRecordCount(user1.address)).to.equal(2n);
      expect(await expiryMate.getRecordCount(user2.address)).to.equal(1n);
    });
  });

  describe("deleteRecord", function () {
    it("should allow record owner to delete their record", async function () {
      const currentTime = await time.latest();
      await expiryMate.connect(user1).addRecord("Driver's License", currentTime + 10000);

      const tx = await expiryMate.connect(user1).deleteRecord(0);
      await expect(tx)
        .to.emit(expiryMate, "RecordDeleted")
        .withArgs(0, user1.address, (await time.latest()));

      const count = await expiryMate.getRecordCount(user1.address);
      expect(count).to.equal(0n);

      const myRecords = await expiryMate.connect(user1).getMyRecords();
      expect(myRecords.length).to.equal(0);
    });

    it("should prevent non-owners from deleting a record", async function () {
      const currentTime = await time.latest();
      await expiryMate.connect(user1).addRecord("Work Permit", currentTime + 10000);

      await expect(
        expiryMate.connect(user2).deleteRecord(0)
      ).to.be.revertedWith("Only owner can delete record");
    });

    it("should reject deleting an already deleted record", async function () {
      const currentTime = await time.latest();
      await expiryMate.connect(user1).addRecord("Subscription", currentTime + 10000);

      await expiryMate.connect(user1).deleteRecord(0);

      await expect(
        expiryMate.connect(user1).deleteRecord(0)
      ).to.be.revertedWith("Record already deleted");
    });

    it("should reject deleting a non-existent record", async function () {
      await expect(
        expiryMate.connect(user1).deleteRecord(999)
      ).to.be.revertedWith("Record does not exist");
    });
  });
});
