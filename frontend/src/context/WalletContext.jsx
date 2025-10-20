import { ethers } from "ethers";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { CROWDFUNDING_ABI } from "../contracts/Crowdfunding";
import { KYC_REGISTRY_ABI } from "../contracts/KYCRegistry";
import {
  CROWDFUNDING_ADDRESS,
  KYC_REGISTRY_ADDRESS,
  NETWORK_CONFIG,
} from "../contracts/addresses";
import { handleContractError } from "../utils/helpers";

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [kycContract, setKycContract] = useState(null);
  const [crowdfundingContract, setCrowdfundingContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const ADMIN_WALLET_ADDRESS = import.meta.env.VITE_ADMIN_WALLET;

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return (
      typeof window !== "undefined" && typeof window.ethereum !== "undefined"
    );
  };

  // Initialize contracts
  const initializeContracts = useCallback(async (signer) => {
    try {
      const kyc = new ethers.Contract(
        KYC_REGISTRY_ADDRESS,
        KYC_REGISTRY_ABI,
        signer
      );
      const crowdfunding = new ethers.Contract(
        CROWDFUNDING_ADDRESS,
        CROWDFUNDING_ABI,
        signer
      );

      setKycContract(kyc);
      setCrowdfundingContract(crowdfunding);

      return { kyc, crowdfunding };
    } catch (error) {
      console.error("Error initializing contracts:", error);
      throw error;
    }
  }, []);

  // Check if user is admin
  const checkAdminStatus = useCallback(async (kyc, userAddress) => {
    try {
      // Use admin address from .env if available
      const envAdmin = ADMIN_WALLET_ADDRESS?.toLowerCase();
      const user = userAddress?.toLowerCase();

      if (envAdmin && user) {
        const isOwner = envAdmin === user;
        setIsAdmin(isOwner);
        return isOwner;
      }

      // Fallback: Try contract owner (if ABI supports it)
      if (kyc.owner) {
        const owner = await kyc.owner();
        const isOwner = owner.toLowerCase() === user;
        setIsAdmin(isOwner);
        return isOwner;
      }

      setIsAdmin(false);
      return false;
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
      return false;
    }
  }, []);

  // Check KYC status
  const checkKYCStatus = useCallback(async (kyc, userAddress) => {
    try {
      const kycData = await kyc.kycRequests(userAddress);
      const verified = await kyc.isVerified(userAddress);

      setKycStatus({
        name: kycData.name,
        cnic: kycData.cnic,
        approved: kycData.approved,
        exists: kycData.exists,
      });
      setIsVerified(verified);

      return { kycData, verified };
    } catch (error) {
      console.error("Error checking KYC status:", error);
      return { kycData: null, verified: false };
    }
  }, []);

  // Get balance
  const updateBalance = useCallback(async (provider, address) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      toast.error("Please install MetaMask to use this DApp");
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const userAccount = accounts[0];

      // Get provider and signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();

      // Get network
      const network = await web3Provider.getNetwork();
      const currentChainId = Number(network.chainId);

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(userAccount);
      setChainId(currentChainId);

      // Initialize contracts
      const { kyc, crowdfunding } = await initializeContracts(web3Signer);

      // Check admin status
      await checkAdminStatus(kyc, userAccount);

      // Check KYC status
      await checkKYCStatus(kyc, userAccount);

      // Update balance
      await updateBalance(web3Provider, userAccount);

      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error(handleContractError(error));
    } finally {
      setIsConnecting(false);
    }
  }, [initializeContracts, checkAdminStatus, checkKYCStatus, updateBalance]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setBalance("0");
    setProvider(null);
    setSigner(null);
    setKycContract(null);
    setCrowdfundingContract(null);
    setChainId(null);
    setIsAdmin(false);
    setIsVerified(false);
    setKycStatus(null);
    toast.info("Wallet disconnected");
  }, []);

  // Switch network
  const switchNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }],
      });
    } catch (error) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}`,
                chainName: NETWORK_CONFIG.chainName,
                rpcUrls: [NETWORK_CONFIG.rpcUrl],
                nativeCurrency: {
                  name: "Ether",
                  symbol: NETWORK_CONFIG.symbol,
                  decimals: NETWORK_CONFIG.decimals,
                },
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
          toast.error("Failed to add network");
        }
      } else {
        console.error("Error switching network:", error);
        toast.error("Failed to switch network");
      }
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    if (!account || !kycContract) return;

    // Only check KYC status for non-admin users
    if (!isAdmin) {
      try {
        const kycData = await kycContract.kycRequests(account);
        setKycStatus({
          name: kycData.name,
          cnic: kycData.cnic,
          approved: kycData.approved,
          exists: kycData.exists,
        });
        const verified = await kycContract.isVerified(account);
        setIsVerified(verified);
      } catch (error) {
        console.error("Error checking KYC status:", error);
      }
    } else {
      // Optionally, clear KYC state for admin
      setKycStatus(null);
      setIsVerified(false);
    }
  }, [account, kycContract, isAdmin]);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [account, connectWallet, disconnectWallet]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };

    checkConnection();
  }, []);

  const value = {
    account,
    balance,
    provider,
    signer,
    kycContract,
    crowdfundingContract,
    isConnecting,
    chainId,
    isAdmin,
    isVerified,
    kycStatus,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshData,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
