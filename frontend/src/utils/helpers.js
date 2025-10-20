import { ethers } from "ethers";

/**
 * Format ETH amount to display with decimals
 */
export const formatEther = (wei) => {
  try {
    return ethers.formatEther(wei);
  } catch (error) {
    console.error("Error formatting ether:", error);
    return "0";
  }
};

/**
 * Parse ETH amount to wei
 */
export const parseEther = (eth) => {
  try {
    return ethers.parseEther(eth.toString());
  } catch (error) {
    console.error("Error parsing ether:", error);
    return 0n;
  }
};

/**
 * Truncate address for display
 */
export const truncateAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format address for display with copy functionality
 */
export const formatAddress = (address) => {
  if (!address) return "N/A";
  return truncateAddress(address);
};

/**
 * Calculate percentage of goal reached
 */
export const calculatePercentage = (raised, goal) => {
  if (!goal || goal === 0n) return "0";
  try {
    const raisedNum = Number(ethers.formatEther(raised));
    const goalNum = Number(ethers.formatEther(goal));
    return ((raisedNum / goalNum) * 100).toFixed(2);
  } catch (e) {
    return "0";
  }
};

/**
 * Get campaign status text
 */
export const getCampaignStatus = (campaign) => {
  if (!campaign) return "Unknown";

  // Check withdrawn first
  if (campaign.withdrawn) return "Withdrawn";

  // Check if completed (goal reached)
  if (campaign.completed) return "Completed";

  // Check if active
  if (campaign.active) return "Active";

  // Default inactive
  return "Inactive";
};

/**
 * Get campaign status color
 */
export const getCampaignStatusColor = (campaign) => {
  if (!campaign) return "gray";

  if (campaign.withdrawn) return "purple";
  if (campaign.completed) return "green";
  if (campaign.active) return "blue";

  return "gray";
};

/**
 * Get KYC status text
 */
export const getKYCStatus = (kycData) => {
  if (!kycData || !kycData.exists) return "Not Submitted";
  if (kycData.approved) return "Approved";
  return "Pending";
};

/**
 * Get KYC status color
 */
export const getKYCStatusColor = (kycData) => {
  if (!kycData || !kycData.exists) return "gray";
  if (kycData.approved) return "green";
  return "yellow";
};

/**
 * Handle contract errors
 */
export const handleContractError = (error) => {
  console.error("Contract Error:", error);

  if (error.code === "ACTION_REJECTED" || error.code === 4001) {
    return "Transaction was cancelled by user";
  }

  if (error.message) {
    if (
      error.message.includes("user rejected") ||
      error.message.includes("User denied")
    ) {
      return "Transaction was cancelled by user";
    }
    if (error.message.includes("insufficient funds")) {
      return "Insufficient funds for transaction";
    }
    if (error.message.includes("execution reverted")) {
      return "Transaction failed - please check the requirements";
    }
  }

  return "An unknown error occurred";
};

/**
 * Validate Ethereum address
 */
export const isValidAddress = (address) => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

/**
 * Format timestamp to date string
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Wait for transaction confirmation
 */
export const waitForTransaction = async (tx, confirmations = 1) => {
  try {
    const receipt = await tx.wait(confirmations);
    return receipt;
  } catch (error) {
    throw new Error(handleContractError(error));
  }
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
};
