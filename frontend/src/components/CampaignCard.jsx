import { Link } from "react-router-dom";
import {
  calculatePercentage,
  formatEther,
  getCampaignStatus,
  getCampaignStatusColor,
  truncateAddress,
} from "../utils/helpers";

const CampaignCard = ({ campaign, campaignId }) => {
  const statusColor = getCampaignStatusColor(campaign);
  const status = getCampaignStatus(campaign);
  const percentage = calculatePercentage(campaign.fundsRaised, campaign.goal);

  const statusColors = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    purple:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    yellow:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header with Status Badge */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
            {campaign.title}
          </h3>
          <span
            className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColors[statusColor]}`}
          >
            {status}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
          {campaign.description}
        </p>

        {/* Creator */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="font-mono">{truncateAddress(campaign.creator)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Funding Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Raised</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {parseFloat(formatEther(campaign.fundsRaised)).toFixed(4)} ETH
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Goal</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {parseFloat(formatEther(campaign.goal)).toFixed(4)} ETH
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <Link
          to={`/campaign/${campaignId}`}
          className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
