export interface ExpiryRecord {
  id: bigint;
  name: string;
  expiryDate: bigint;
  owner: `0x${string}`;
  createdAt: bigint;
  isDeleted: boolean;
}

export type StatusCategory = "safe" | "warning" | "expired";

export interface CountdownInfo {
  formattedText: string;
  category: StatusCategory;
  daysRemaining: number;
  isExpired: boolean;
  isToday: boolean;
}

