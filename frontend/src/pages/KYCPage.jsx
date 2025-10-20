import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { useWallet } from "../context/WalletContext";
import {
  getKYCStatus,
  getKYCStatusColor,
  handleContractError,
} from "../utils/helpers";

const KYCPage = () => {
  const { account, kycContract, kycStatus, isVerified, refreshData, isAdmin } =
    useWallet();
  const [formData, setFormData] = useState({
    name: "",
    cnic: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (account && kycContract) {
      refreshData();
    }
  }, [account, kycContract, refreshData]);

  useEffect(() => {
    if (isAdmin) {
      navigate("/"); // Redirect admin to home
    }
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!formData.name.trim() || !formData.cnic.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.cnic.length !== 13) {
      toast.error("CNIC must be 13 digits");
      return;
    }

    setIsSubmitting(true);

    try {
      const tx = await kycContract.submitKYC(formData.name, formData.cnic);

      toast.info("Transaction submitted. Waiting for confirmation...");

      await tx.wait();

      toast.success(
        "KYC submitted successfully! Please wait for admin approval."
      );

      setFormData({ name: "", cnic: "" });

      // Refresh KYC status
      await refreshData();
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error(handleContractError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColor = getKYCStatusColor(kycStatus);
  const status = getKYCStatus(kycStatus);

  const statusColors = {
    green: "bg-green-100 text-green-800 border-green-300",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
    gray: "bg-gray-100 text-gray-800 border-gray-300",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading KYC data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            KYC Verification
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Complete your KYC to create and manage campaigns
          </p>
        </div>

        {!account ? (
          <div className="p-8 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Wallet Not Connected
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please connect your wallet to submit KYC
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Status Card */}
            {kycStatus && kycStatus.exists && (
              <div
                className={`border-2 rounded-lg p-6 ${statusColors[statusColor]}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Current KYC Status</h3>
                  <span className="px-4 py-2 font-semibold bg-white rounded-lg">
                    {status}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium opacity-75">Name</p>
                    <p className="text-lg font-semibold">{kycStatus.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-75">CNIC</p>
                    <p className="font-mono text-lg font-semibold">
                      {kycStatus.cnic}
                    </p>
                  </div>
                </div>

                {isVerified && (
                  <div className="flex items-center mt-4 space-x-2">
                    <svg
                      className="w-5 h-5 text-green-600"
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
                    <span className="font-semibold">
                      Your KYC is approved! You can now create campaigns.
                    </span>
                  </div>
                )}

                {!isVerified && kycStatus.exists && (
                  <div className="flex items-center mt-4 space-x-2">
                    <svg
                      className="w-5 h-5 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-semibold">
                      Your KYC is pending admin approval.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* KYC Form */}
            {!kycStatus?.exists && (
              <div className="p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                  Submit KYC Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  {/* CNIC Field */}
                  <div>
                    <label
                      htmlFor="cnic"
                      className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      CNIC (13 digits) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="cnic"
                      name="cnic"
                      value={formData.cnic}
                      onChange={handleChange}
                      placeholder="1234567890123"
                      maxLength="13"
                      pattern="[0-9]{13}"
                      className="w-full px-4 py-3 font-mono border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Enter your 13-digit CNIC number without dashes
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900 dark:border-blue-700">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-500 dark:text-blue-300 mt-0.5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="mb-1 font-semibold">
                          Important Information:
                        </p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>Your KYC will be reviewed by an admin</li>
                          <li>You can only submit KYC once per address</li>
                          <li>Approval is required to create campaigns</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center w-full px-6 py-3 space-x-2 font-semibold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    {isSubmitting ? (
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
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit KYC</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCPage;
