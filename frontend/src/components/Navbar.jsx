import { Link, useLocation } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { truncateAddress } from "../utils/helpers";

const Navbar = () => {
  const {
    account,
    balance,
    isAdmin,
    isVerified,
    connectWallet,
    disconnectWallet,
    isConnecting,
  } = useWallet();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-blue-500 font-semibold"
      : "text-gray-700 dark:text-gray-300 hover:text-blue-500";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg dark:bg-gray-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
              CrowdFund DApp
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="items-center hidden space-x-6 md:flex">
            <Link to="/" className={`${isActive("/")} transition-colors`}>
              Home
            </Link>
            <Link
              to="/campaigns"
              className={`${isActive("/campaigns")} transition-colors`}
            >
              Campaigns
            </Link>
            {(isVerified || isAdmin) && (
              <Link
                to="/create-campaign"
                className={`${isActive("/create-campaign")} transition-colors`}
              >
                Create Campaign
              </Link>
            )}
            {!isAdmin && (
              <Link
                to="/kyc"
                className={`${isActive("/kyc")} transition-colors`}
              >
                KYC
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`${isActive(
                  "/admin"
                )} transition-colors bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-md`}
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {account ? (
              <div className="flex items-center space-x-3">
                {/* Status Badges */}
                <div className="items-center hidden space-x-2 lg:flex">
                  {isAdmin && (
                    <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded dark:bg-purple-900 dark:text-purple-200">
                      Admin
                    </span>
                  )}
                  {isVerified && (
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded dark:bg-green-900 dark:text-green-200">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Balance */}
                <div className="hidden text-sm text-gray-700 sm:block dark:text-gray-300">
                  <span className="font-semibold">
                    {parseFloat(balance).toFixed(4)} ETH
                  </span>
                </div>

                {/* Account Address */}
                <div className="flex items-center px-3 py-2 space-x-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {truncateAddress(account)}
                  </span>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center px-6 py-2 space-x-2 font-medium text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isConnecting ? (
                  <>
                    <svg
                      className="w-5 h-5 text-white animate-spin"
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
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>Connect Wallet</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {account && (
          <div className="flex flex-wrap gap-2 pt-2 pb-4 md:hidden">
            <Link
              to="/"
              className={`${isActive("/")} px-3 py-1 rounded-md text-sm`}
            >
              Home
            </Link>
            <Link
              to="/campaigns"
              className={`${isActive(
                "/campaigns"
              )} px-3 py-1 rounded-md text-sm`}
            >
              Campaigns
            </Link>
            {(isVerified || isAdmin) && (
              <Link
                to="/create-campaign"
                className={`${isActive(
                  "/create-campaign"
                )} px-3 py-1 rounded-md text-sm`}
              >
                Create
              </Link>
            )}
            <Link
              to="/kyc"
              className={`${isActive("/kyc")} px-3 py-1 rounded-md text-sm`}
            >
              KYC
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`${isActive(
                  "/admin"
                )} px-3 py-1 rounded-md text-sm bg-purple-100 dark:bg-purple-900`}
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
