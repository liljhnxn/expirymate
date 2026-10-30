// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ExpiryMate
 * @dev Decentralized expiration tracker on the blockchain.
 * Tagline: Never miss an expiry date.
 */
contract ExpiryMate {
    struct Record {
        uint256 id;
        string name;
        uint256 expiryDate;
        address owner;
        uint256 createdAt;
        bool isDeleted;
    }

    // All records indexed by their unique ID
    Record[] private records;

    // Mapping from user address to their record IDs
    mapping(address => uint256[]) private userRecordIds;

    // Events
    event RecordAdded(
        uint256 indexed id,
        address indexed owner,
        string name,
        uint256 expiryDate,
        uint256 createdAt
    );

    event RecordDeleted(
        uint256 indexed id,
        address indexed owner,
        uint256 deletedAt
    );

    /**
     * @notice Add a new expiry record
     * @param name Name of the item (e.g. "Passport", "Driver's License")
     * @param expiryDate Expiration timestamp in seconds (must be in the future)
     */
    function addRecord(string calldata name, uint256 expiryDate) external returns (uint256) {
        require(bytes(name).length > 0, "Item name cannot be empty");
        require(expiryDate > block.timestamp, "Expiry date must be in the future");

        uint256 newId = records.length;
        Record memory newRecord = Record({
            id: newId,
            name: name,
            expiryDate: expiryDate,
            owner: msg.sender,
            createdAt: block.timestamp,
            isDeleted: false
        });

        records.push(newRecord);
        userRecordIds[msg.sender].push(newId);

        emit RecordAdded(newId, msg.sender, name, expiryDate, block.timestamp);
        return newId;
    }

    /**
     * @notice Delete an existing record owned by the caller
     * @param recordId ID of the record to delete
     */
    function deleteRecord(uint256 recordId) external {
        require(recordId < records.length, "Record does not exist");
        Record storage record = records[recordId];
        require(record.owner == msg.sender, "Only owner can delete record");
        require(!record.isDeleted, "Record already deleted");

        record.isDeleted = true;

        emit RecordDeleted(recordId, msg.sender, block.timestamp);
    }

    /**
     * @notice Get all active (non-deleted) records for the caller
     */
    function getMyRecords() external view returns (Record[] memory) {
        uint256[] storage ids = userRecordIds[msg.sender];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (!records[ids[i]].isDeleted) {
                activeCount++;
            }
        }

        Record[] memory myRecords = new Record[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            uint256 recordId = ids[i];
            if (!records[recordId].isDeleted) {
                myRecords[currentIndex] = records[recordId];
                currentIndex++;
            }
        }

        return myRecords;
    }

    /**
     * @notice Get total count of active records for a given user
     * @param user Address of the user
     */
    function getRecordCount(address user) external view returns (uint256) {
        uint256[] storage ids = userRecordIds[user];
        uint256 activeCount = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            if (!records[ids[i]].isDeleted) {
                activeCount++;
            }
        }
        return activeCount;
    }

    /**
     * @notice Get a specific record by ID
     */
    function getRecord(uint256 recordId) external view returns (Record memory) {
        require(recordId < records.length, "Record does not exist");
        return records[recordId];
    }
}

