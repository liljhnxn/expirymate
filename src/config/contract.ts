import { parseAbi } from "viem";
import deployment from "./deployment.json";

export const MAINNET_CONTRACT_ADDRESS = "0xbDcBdb48271D430f3051bABA75934fB928A61171" as const;

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  deployment.contractAddress ||
  MAINNET_CONTRACT_ADDRESS) as `0x${string}`;

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
