import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { useWallet } from "../context/WalletContext";
import { handleContractError, truncateAddress } from "../utils/helpers";

const AdminPage = () => {
  const { account, kycContract, isAdmin, provider } = useWallet();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    if (account && kycContract && isAdmin) {
      fetchPendingRequests();
    }
  }, [account, kycContract, isAdmin]);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      // Listen to past KYCRequested events
      const filter = kycContract.filters.KYCRequested();
      const events = await kycContract.queryFilter(filter);

      // Check status for each request
      const requests = await Promise.all(
        events.map(async (event) => {
          const userAddress = event.args.user;
          const kycData = await kycContract.kycRequests(userAddress);

          // Only include if exists and not approved
          if (kycData.exists && !kycData.approved) {
            return {
              address: userAddress,
              name: kycData.name,
              cnic: kycData.cnic,
              approved: kycData.approved,
              exists: kycData.exists,
            };
          }
          return null;
        })
      );

      // Filter out null values and duplicates
      const validRequests = requests.filter((r) => r !== null);
      const uniqueRequests = validRequests.filter(
        (request, index, self) =>
          index === self.findIndex((r) => r.address === request.address)
      );

      setPendingRequests(uniqueRequests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      toast.error("Failed to fetch pending KYC requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userAddress) => {
    setProcessing({ ...processing, [userAddress]: "approving" });

    try {
      const tx = await kycContract.approveKYC(userAddress);
      toast.info("Approval transaction submitted. Waiting for confirmation...");

      await tx.wait();

      toast.success(`KYC approved for ${truncateAddress(userAddress)}`);

      // Refresh the list
      await fetchPendingRequests();
    } catch (error) {
      console.error("Error approving KYC:", error);
      toast.error(handleContractError(error));
    } finally {
      setProcessing({ ...processing, [userAddress]: null });
    }
  };

  const handleReject = async (userAddress) => {
    setProcessing({ ...processing, [userAddress]: "rejecting" });

    try {
      const tx = await kycContract.rejectKYC(userAddress);
      toast.info(
        "Rejection transaction submitted. Waiting for confirmation..."
      );

      await tx.wait();

      toast.success(`KYC rejected for ${truncateAddress(userAddress)}`);

      // Refresh the list
      await fetchPendingRequests();
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      toast.error(handleContractError(error));
    } finally {
      setProcessing({ ...processing, [userAddress]: null });
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center max-w-md">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please connect your wallet to access the admin panel
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center max-w-md">
          <svg
            className="w-16 h-16 mx-auto text-red-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have admin privileges to access this page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage KYC verification requests
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending KYC Requests</p>
              <p className="text-4xl font-bold">{pendingRequests.length}</p>
            </div>
            <svg
              className="w-16 h-16 opacity-50"
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
        </div>

        {/* Pending Requests */}
        {loading ? (
          <LoadingSpinner size="lg" text="Loading pending requests..." />
        ) : pendingRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Pending Requests
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All KYC requests have been processed
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.address}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* User Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Wallet Address
                      </p>
                      <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                        {request.address}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Name
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {request.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          CNIC
                        </p>
                        <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                          {request.cnic}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 lg:ml-6">
                    <button
                      onClick={() => handleApprove(request.address)}
                      disabled={processing[request.address]}
                      className="flex-1 lg:flex-none px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      {processing[request.address] === "approving" ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
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
                          <span>Approving...</span>
                        </>
                      ) : (
                        <>
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Approve</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleReject(request.address)}
                      disabled={processing[request.address]}
                      className="flex-1 lg:flex-none px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      {processing[request.address] === "rejecting" ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
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
                          <span>Rejecting...</span>
                        </>
                      ) : (
                        <>
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span>Reject</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
