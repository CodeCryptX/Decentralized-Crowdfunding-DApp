import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { useWallet } from "../context/WalletContext";
import {
  calculatePercentage,
  formatEther,
  getCampaignStatus,
  getCampaignStatusColor,
  handleContractError,
  parseEther,
} from "../utils/helpers";

function safeFormatEther(value) {
  if (value == null) return "0";
  try {
    return formatEther(value);
  } catch (e) {
    return "0";
  }
}

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account, crowdfundingContract, refreshData } = useWallet();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contributionAmount, setContributionAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const campaignData = await crowdfundingContract.campaigns(id);

        // Defensive: Check for valid campaign
        if (
          !campaignData ||
          !campaignData.creator ||
          campaignData.creator === "0x0000000000000000000000000000000000000000"
        ) {
          setCampaign(null);
        } else {
          // Properly structure the campaign object
          setCampaign({
            id,
            title: campaignData.title || "",
            description: campaignData.description || "",
            goal: campaignData.goal || 0n,
            fundsRaised: campaignData.fundsRaised || 0n,
            creator: campaignData.creator || "",
            active: Boolean(campaignData.active),
            completed: Boolean(campaignData.completed),
            withdrawn: Boolean(campaignData.withdrawn),
          });
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
        setCampaign(null);
      }
      setLoading(false);
    };

    if (crowdfundingContract && id !== undefined) {
      fetchCampaign();
    }
  }, [crowdfundingContract, id]);

  const handleContribute = async () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error("Please enter a valid contribution amount");
      return;
    }
    setIsContributing(true);
    try {
      const amountInWei = parseEther(contributionAmount);
      const tx = await crowdfundingContract.contribute(id, {
        value: amountInWei,
      });
      toast.info("Transaction submitted. Processing contribution...");
      await tx.wait();
      toast.success(`Successfully contributed ${contributionAmount} ETH!`);
      setContributionAmount("");
      setShowContributeModal(false);
      await refreshData();

      // Refetch campaign after contribution
      if (crowdfundingContract && id !== undefined) {
        const updatedCampaign = await crowdfundingContract.campaigns(id);
        setCampaign({
          id,
          title: updatedCampaign.title || "",
          description: updatedCampaign.description || "",
          goal: updatedCampaign.goal || 0n,
          fundsRaised: updatedCampaign.fundsRaised || 0n,
          creator: updatedCampaign.creator || "",
          active: Boolean(updatedCampaign.active),
          completed: Boolean(updatedCampaign.completed),
          withdrawn: Boolean(updatedCampaign.withdrawn),
        });
      }
    } catch (error) {
      console.error("Error contributing:", error);
      toast.error(handleContractError(error));
    } finally {
      setIsContributing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }
    setIsWithdrawing(true);
    try {
      const tx = await crowdfundingContract.withdraw(id);
      toast.info("Transaction submitted. Processing withdrawal...");
      await tx.wait();
      toast.success("Funds withdrawn successfully!");
      await refreshData();
      // Refetch campaign after withdrawal
      if (crowdfundingContract && id !== undefined) {
        const campaignData = await crowdfundingContract.campaigns(id);
        setCampaign({ ...campaignData, id });
      }
    } catch (error) {
      console.error("Error withdrawing:", error);
      toast.error(handleContractError(error));
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading campaign..." />
      </div>
    );
  }

  // Defensive: If campaign is invalid, show message
  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600 dark:text-gray-300">
          Campaign not found or invalid.
        </div>
      </div>
    );
  }

  const statusColor = getCampaignStatusColor(campaign);
  const status = getCampaignStatus(campaign);
  const percentage = calculatePercentage(campaign.fundsRaised, campaign.goal);

  // Defensive: check for valid creator
  const isCreator =
    typeof campaign?.creator === "string" &&
    typeof account === "string" &&
    campaign.creator.toLowerCase() === account.toLowerCase();

  // Only creator can withdraw when campaign is completed and not withdrawn
  const canWithdraw = isCreator && campaign.completed && !campaign.withdrawn;

  // Anyone can contribute if campaign is active and not completed
  const canContribute = campaign.active && !campaign.completed;

  const statusColors = {
    green: "bg-green-100 text-green-800 border-green-300",
    blue: "bg-blue-100 text-blue-800 border-blue-300",
    purple: "bg-purple-100 text-purple-800 border-purple-300",
    gray: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/campaigns")}
          className="flex items-center mb-6 space-x-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-500"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Campaigns</span>
        </button>

        {/* Campaign Card */}
        <div className="overflow-hidden bg-white shadow-lg dark:bg-gray-800 rounded-xl">
          {/* Header */}
          <div className="p-8 text-white bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="flex items-start justify-between mb-4">
              <h1 className="flex-1 text-3xl font-bold">{campaign.title}</h1>
              <span
                className={`ml-4 px-4 py-2 rounded-full text-sm font-semibold bg-white ${statusColors[statusColor]} border-2`}
              >
                {status}
              </span>
            </div>

            {/* Creator Badge */}
            {isCreator && (
              <div className="inline-flex items-center px-3 py-1 text-sm bg-white rounded-full bg-opacity-20">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                You created this campaign
              </div>
            )}
          </div>

          {/* Progress Section */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Funding Progress
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {percentage}%
                </span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className="h-4 transition-all duration-300 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                  style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 text-center rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  Raised
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {parseFloat(safeFormatEther(campaign.fundsRaised)).toFixed(4)}{" "}
                  ETH
                </p>
              </div>
              <div className="p-4 text-center rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  Goal
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {parseFloat(safeFormatEther(campaign.goal)).toFixed(4)} ETH
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              About This Campaign
            </h2>
            <p className="leading-relaxed text-gray-700 whitespace-pre-wrap dark:text-gray-300">
              {campaign.description}
            </p>
          </div>

          {/* Creator Info */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              Campaign Creator
            </h3>
            <div className="flex items-center p-4 space-x-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                {typeof campaign.creator === "string"
                  ? campaign.creator.slice(2, 4).toUpperCase()
                  : "--"}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ethereum Address
                </p>
                <p className="font-mono font-semibold text-gray-900 dark:text-white">
                  {campaign.creator || "--"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-8">
            <div className="space-y-3">
              {canContribute && (
                <button
                  onClick={() => setShowContributeModal(true)}
                  className="flex items-center justify-center w-full py-4 space-x-2 text-lg font-semibold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Contribute to Campaign</span>
                </button>
              )}

              {canWithdraw && (
                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="flex items-center justify-center w-full py-4 space-x-2 text-lg font-semibold text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                >
                  {isWithdrawing ? (
                    <>
                      <svg
                        className="w-6 h-6 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Withdrawing...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>Withdraw Funds</span>
                    </>
                  )}
                </button>
              )}

              {!canContribute && !canWithdraw && (
                <div className="py-4 text-center text-gray-600 dark:text-gray-400">
                  {campaign.withdrawn && "Funds have been withdrawn"}
                  {campaign.completed &&
                    !campaign.withdrawn &&
                    !isCreator &&
                    "Campaign goal reached - only creator can withdraw"}
                  {!campaign.active &&
                    !campaign.completed &&
                    "Campaign is not active"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contribute Modal */}
      <Modal
        isOpen={showContributeModal}
        onClose={() => setShowContributeModal(false)}
        title="Contribute to Campaign"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="amount"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Contribution Amount (ETH)
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="0.0"
                step="0.001"
                min="0"
                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="font-semibold text-gray-500 dark:text-gray-400">
                  ETH
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleContribute}
            disabled={isContributing}
            className="flex items-center justify-center w-full py-3 space-x-2 font-semibold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isContributing ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>Confirm Contribution</span>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignDetailPage;
