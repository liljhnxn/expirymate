import { CountdownInfo, StatusCategory } from "../types";

export function getCountdown(expiryTimestampSeconds: bigint | number): CountdownInfo {
  const expirySec = Number(expiryTimestampSeconds);
  const nowSec = Math.floor(Date.now() / 1000);
  const diffSec = expirySec - nowSec;

  if (diffSec <= 0) {
    return {
      formattedText: "Expired",
      category: "expired",
      daysRemaining: 0,
      isExpired: true,
      isToday: false,
    };
  }

  const days = Math.floor(diffSec / 86400);

  let formattedText = "";
  let isToday = false;

  if (days === 0) {
    formattedText = "Expires today";
    isToday = true;
  } else if (days === 1) {
    formattedText = "1 day left";
  } else {
    formattedText = `${days} days left`;
  }

  let category: StatusCategory = "safe";
  if (days <= 30) {
    category = "warning";
  }

  return {
    formattedText,
    category,
    daysRemaining: days,
    isExpired: false,
    isToday,
  };
}

export function formatExpiryDate(timestampSeconds: bigint | number): string {
  const date = new Date(Number(timestampSeconds) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

