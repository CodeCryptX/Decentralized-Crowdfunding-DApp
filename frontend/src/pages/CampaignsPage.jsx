import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CampaignCard from "../components/CampaignCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useWallet } from "../context/WalletContext";

const CampaignsPage = () => {
  const { crowdfundingContract, account } = useWallet();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, completed, withdrawn

  useEffect(() => {
    if (crowdfundingContract) {
      fetchCampaigns();
    }
  }, [crowdfundingContract]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const count = await crowdfundingContract.campaignCount();
      const campaignPromises = [];

      // One-based: 1 to count
      for (let i = 1; i <= Number(count); i++) {
        campaignPromises.push(crowdfundingContract.campaigns(i));
      }

      const campaignsData = await Promise.all(campaignPromises);

      const formattedCampaigns = campaignsData
        .map((campaign, index) => ({
          id: index + 1, // Campaign ID is index + 1
          title: campaign.title || "",
          description: campaign.description || "",
          goal: campaign.goal || 0n,
          fundsRaised: campaign.fundsRaised || 0n,
          creator: campaign.creator || "",
          active: Boolean(campaign.active),
          completed: Boolean(campaign.completed),
          withdrawn: Boolean(campaign.withdrawn),
        }))
        .filter(
          (campaign) =>
            typeof campaign.creator === "string" &&
            campaign.creator !== "0x0000000000000000000000000000000000000000"
        )
        .reverse(); // Most recent first

      setCampaigns(formattedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filter === "all") return true;
    if (filter === "active") return campaign.active;
    if (filter === "completed")
      return campaign.completed && !campaign.withdrawn;
    if (filter === "withdrawn") return campaign.withdrawn;
    return true;
  });

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Browse Campaigns
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover and support amazing projects on the blockchain
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            All Campaigns
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              filter === "active"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              filter === "completed"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("withdrawn")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              filter === "withdrawn"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            Withdrawn
          </button>
        </div>

        {/* Campaign Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredCampaigns.length}
            </span>{" "}
            campaign{filteredCampaigns.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <LoadingSpinner size="lg" text="Loading campaigns..." />
        ) : filteredCampaigns.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No Campaigns Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === "all"
                ? "No campaigns have been created yet. Be the first to create one!"
                : `No ${filter} campaigns at the moment.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                campaignId={campaign.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;
