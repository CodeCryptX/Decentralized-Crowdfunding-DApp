# Decentralized Crowdfunding DApp - Frontend

A modern, responsive React frontend for the Decentralized Crowdfunding DApp built with **React**, **Vite**, **Ethers.js**, and **Tailwind CSS**.

## 🚀 Features

### Core Functionality

- **MetaMask Integration** - Seamless wallet connection with real-time balance updates
- **KYC Verification System** - Submit and track KYC status
- **Campaign Management** - Create, browse, and contribute to campaigns
- **Admin Dashboard** - Approve/reject KYC requests (admin only)
- **Fund Withdrawal** - Campaign creators can withdraw completed campaign funds

### User Experience

- **Responsive Design** - Works flawlessly on desktop, tablet, and mobile
- **Dark Mode Support** - Automatic dark mode styling
- **Real-time Updates** - Campaign status and balances update instantly
- **Toast Notifications** - User-friendly feedback for all transactions
- **Loading States** - Smooth loading animations and progress indicators

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Ethers.js v6** - Ethereum blockchain interaction
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **React Toastify** - Beautiful toast notifications

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Anvil/Foundry running locally with contracts deployed

### Setup Steps

1. **Install Dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure Contract Addresses**

   The contract addresses are already configured in `src/contracts/addresses.js`:

   - KYC Registry: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
   - Crowdfunding: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

   Update these if you redeploy the contracts.

3. **Start Development Server**

   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:3000`

4. **Configure MetaMask**
   - Add Anvil/Localhost network:
     - Network Name: Localhost 31337
     - RPC URL: http://127.0.0.1:8545
     - Chain ID: 31337
     - Currency Symbol: ETH

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation bar with wallet connection
│   │   ├── Footer.jsx       # Footer with developer info
│   │   ├── CampaignCard.jsx # Campaign display card
│   │   ├── LoadingSpinner.jsx # Loading animation
│   │   └── Modal.jsx        # Reusable modal component
│   ├── pages/               # Page components
│   │   ├── HomePage.jsx     # Landing page
│   │   ├── CampaignsPage.jsx # Campaign listing
│   │   ├── CampaignDetailPage.jsx # Individual campaign
│   │   ├── CreateCampaignPage.jsx # Campaign creation
│   │   ├── KYCPage.jsx      # KYC submission
│   │   └── AdminPage.jsx    # Admin dashboard
│   ├── context/             # React Context
│   │   └── WalletContext.jsx # Wallet & contract state
│   ├── contracts/           # Smart contract ABIs & addresses
│   │   ├── addresses.js     # Contract addresses
│   │   ├── KYCRegistry.js   # KYC ABI
│   │   └── Crowdfunding.js  # Crowdfunding ABI
│   ├── utils/               # Helper functions
│   │   └── helpers.js       # Formatting & utility functions
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 Usage Guide

### For Users

1. **Connect Wallet**

   - Click "Connect Wallet" in the navbar
   - Approve MetaMask connection

2. **Submit KYC** (Required to create campaigns)

   - Navigate to KYC page
   - Enter your name and CNIC (13 digits)
   - Wait for admin approval

3. **Browse Campaigns**

   - View all active campaigns
   - Filter by status (Active, Completed, Withdrawn)
   - Check campaign details and progress

4. **Contribute to Campaigns**
   - Click on any campaign card
   - Enter contribution amount in ETH
   - Confirm transaction in MetaMask

### For Campaign Creators

1. **Create Campaign** (KYC required, except for admin)

   - Navigate to "Create Campaign"
   - Fill in title, description, and funding goal
   - Submit and confirm transaction
   - **Note:** Admin wallet can create campaigns without KYC verification

2. **Withdraw Funds**
   - Wait for campaign to reach goal
   - Open your completed campaign
   - Click "Withdraw Funds"
   - Confirm transaction

### For Admins

1. **Access Admin Dashboard**

   - Only available to contract owner
   - Navigate to "Admin Panel"

2. **Manage KYC Requests**

   - View all pending KYC submissions
   - Approve or reject requests
   - Confirm transactions

3. **Create Campaigns Without KYC**

   - Admin can bypass KYC verification
   - Directly create campaigns as needed

4. **Access Admin Dashboard**

   - Only available to contract owner
   - Navigate to "Admin Panel"

5. **Manage KYC Requests**
   - View all pending KYC submissions
   - Approve or reject requests
   - Confirm transactions

## 🔗 Smart Contract Integration

The frontend interacts with two main contracts:

### KYC Registry Contract

- Submit KYC information
- Check verification status
- Admin approval/rejection

### Crowdfunding Contract

- Create campaigns
- Contribute to campaigns
- Withdraw completed campaign funds
- View campaign details

## 🎨 Customization

### Update Contract Addresses

Edit `src/contracts/addresses.js`:

```javascript
export const KYC_REGISTRY_ADDRESS = "0x...";
export const CROWDFUNDING_ADDRESS = "0x...";
```

### Modify Network Configuration

Edit `src/contracts/addresses.js`:

```javascript
export const NETWORK_CONFIG = {
  chainId: 31337,
  chainName: "Localhost 31337",
  rpcUrl: "http://127.0.0.1:8545",
  symbol: "ETH",
  decimals: 18,
};
```

### Change Theme Colors

Edit `tailwind.config.js` to customize colors and styling.

## 🐛 Troubleshooting

### MetaMask Not Connecting

- Ensure MetaMask is installed
- Check that you're on the correct network (Localhost 31337)
- Try refreshing the page

### Transactions Failing

- Check your ETH balance for gas
- Ensure Anvil is running
- Verify contract addresses are correct

### KYC Not Working

- Ensure you haven't already submitted KYC
- Wait for admin approval before creating campaigns

## 📸 Screenshots

### Home Page

Beautiful landing page with features and call-to-action

### Campaign Listing

Grid view of all campaigns with filtering options

### Campaign Details

Detailed view with contribution interface

### KYC Submission

Simple form for KYC verification

### Admin Dashboard

Manage pending KYC requests

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

### Deploy to Web3 Hosting

- **IPFS**: Use `ipfs add -r dist/`
- **Fleek**: Connect your repository
- **Vercel/Netlify**: Deploy the `dist` folder

## 👨‍💻 Developer

**Hassan Murtaza**

Decentralized Crowdfunding DApp  
Built with ❤️ using React, Ethers.js, and Solidity

---

© 2025 Hassan Murtaza. All rights reserved.
