import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

const HomePage = () => {
  const { account, isVerified, isAdmin } = useWallet();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold md:text-6xl animate-fade-in">
              Decentralized Crowdfunding
            </h1>
            <p className="max-w-3xl mx-auto mb-8 text-xl text-gray-100 md:text-2xl">
              Fund innovative projects on the blockchain with transparency,
              security, and complete trust
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/campaigns"
                className="px-8 py-4 text-lg font-semibold text-blue-600 transition-colors bg-white rounded-lg shadow-lg hover:bg-gray-100"
              >
                Browse Campaigns
              </Link>
              {account && (isVerified || isAdmin) && (
                <Link
                  to="/create-campaign"
                  className="px-8 py-4 text-lg font-semibold text-white transition-colors bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-blue-600"
                >
                  Create Campaign
                </Link>
              )}
              {account && !isVerified && !isAdmin && (
                <Link
                  to="/kyc"
                  className="px-8 py-4 text-lg font-semibold text-white transition-colors bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-600"
                >
                  Complete KYC
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900 dark:text-white">
          Why Choose Our Platform?
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="p-8 transition-shadow bg-white shadow-lg dark:bg-gray-800 rounded-xl hover:shadow-xl">
            <div className="flex items-center justify-center w-16 h-16 mb-6 bg-blue-100 rounded-full dark:bg-blue-900">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
              Secure & Transparent
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All transactions are recorded on the blockchain, ensuring complete
              transparency and security for both creators and contributors.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 transition-shadow bg-white shadow-lg dark:bg-gray-800 rounded-xl hover:shadow-xl">
            <div className="flex items-center justify-center w-16 h-16 mb-6 bg-purple-100 rounded-full dark:bg-purple-900">
              <svg
                className="w-8 h-8 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
              KYC Verified
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Campaign creators undergo KYC verification, adding an extra layer
              of trust and credibility to every project.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 transition-shadow bg-white shadow-lg dark:bg-gray-800 rounded-xl hover:shadow-xl">
            <div className="flex items-center justify-center w-16 h-16 mb-6 bg-green-100 rounded-full dark:bg-green-900">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
              Fast & Efficient
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Instant contributions and withdrawals powered by smart contracts.
              No intermediaries, no delays, just pure efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900 dark:text-white">
            How It Works
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Step 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold text-white bg-blue-500 rounded-full">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Connect Wallet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect your MetaMask wallet to get started
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold text-white bg-purple-500 rounded-full">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Complete KYC
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Submit KYC details for verification (creators only)
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold text-white bg-green-500 rounded-full">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Create or Fund
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Launch your campaign or support existing projects
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold text-white bg-pink-500 rounded-full">
                4
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Achieve Goals
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Reach funding goals and withdraw funds instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-12 shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
          <div className="grid grid-cols-1 gap-8 text-center text-white md:grid-cols-3">
            <div>
              <p className="mb-2 text-5xl font-bold">100%</p>
              <p className="text-xl opacity-90">Transparent</p>
            </div>
            <div>
              <p className="mb-2 text-5xl font-bold">0%</p>
              <p className="text-xl opacity-90">Platform Fees</p>
            </div>
            <div>
              <p className="mb-2 text-5xl font-bold">24/7</p>
              <p className="text-xl opacity-90">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">
            Join the future of crowdfunding on the blockchain
          </p>
          {!account ? (
            <div className="flex justify-center">
              <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-700">
                <p className="mb-4 text-gray-800 dark:text-gray-200">
                  Connect your wallet to explore campaigns and start
                  contributing
                </p>
                <button className="px-8 py-3 font-semibold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600">
                  Connect Wallet
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/campaigns"
                className="px-8 py-4 text-lg font-semibold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Explore Campaigns
              </Link>
              {(isVerified || isAdmin) && (
                <Link
                  to="/create-campaign"
                  className="px-8 py-4 text-lg font-semibold text-white transition-colors bg-purple-500 rounded-lg hover:bg-purple-600"
                >
                  Create Your Campaign
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 mt-20 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <p className="text-lg font-semibold text-white">
            Developed by HassanMurtaza-i221110
          </p>
          <p className="mt-2 text-sm text-blue-100">
            Assignment 2 - Decentralized Crowdfunding DApp
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
