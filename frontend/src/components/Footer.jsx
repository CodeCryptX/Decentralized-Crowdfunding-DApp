const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              CrowdFund DApp
            </h3>
            <p className="text-gray-400 text-sm">
              A decentralized crowdfunding platform built on Ethereum blockchain
              with KYC verification.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/campaigns"
                  className="hover:text-blue-400 transition-colors"
                >
                  Browse Campaigns
                </a>
              </li>
              <li>
                <a
                  href="/kyc"
                  className="hover:text-blue-400 transition-colors"
                >
                  KYC Verification
                </a>
              </li>
              <li>
                <a
                  href="/create-campaign"
                  className="hover:text-blue-400 transition-colors"
                >
                  Create Campaign
                </a>
              </li>
            </ul>
          </div>

          {/* Contract Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Smart Contracts</h4>
            <div className="text-gray-400 text-sm space-y-2">
              <div>
                <p className="text-gray-500">KYC Registry:</p>
                <p className="font-mono text-xs break-all">0xe7f1...0512</p>
              </div>
              <div>
                <p className="text-gray-500">Crowdfunding:</p>
                <p className="font-mono text-xs break-all">0x9fE4...a6e0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            Developed by{" "}
            <span className="text-blue-400 font-semibold">Hassan Murtaza</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            © {new Date().getFullYear()} Decentralized Crowdfunding DApp. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
