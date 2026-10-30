import { parseAbi } from "viem";
import deployment from "./deployment.json";

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  deployment.contractAddress ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const CONTRACT_ABI = parseAbi([
  "struct Record { uint256 id; string name; uint256 expiryDate; address owner; uint256 createdAt; bool isDeleted; }",
  "function addRecord(string calldata name, uint256 expiryDate) external returns (uint256)",
  "function deleteRecord(uint256 recordId) external",
  "function getMyRecords() external view returns (Record[] memory)",
  "function getRecordCount(address user) external view returns (uint256)",
  "function getRecord(uint256 recordId) external view returns (Record memory)",
  "event RecordAdded(uint256 indexed id, address indexed owner, string name, uint256 expiryDate, uint256 createdAt)",
  "event RecordDeleted(uint256 indexed id, address indexed owner, uint256 deletedAt)",
]);
