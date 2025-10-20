# Decentralized Crowdfunding DApp 🚀

A full-stack decentralized crowdfunding platform on Ethereum with KYC verification.

**Developed by Hassan Murtaza**

---

## 🌟 Overview

- Verified users can create campaigns
- Anyone can contribute ETH
- Creators withdraw funds after goal completion
- Admin manages KYC requests

---

## 📦 Project Structure

```
Decentralized-Crowdfunding-DApp/
├── foundry/         # Smart contracts (Solidity + Foundry)
├── frontend/        # React frontend (Vite + Tailwind)
├── README.md        # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- Foundry/Anvil
- MetaMask

### 1. Start Local Blockchain

```bash
anvil
```

### 2. Deploy Contracts

```bash
cd foundry
forge script script/DeployKYCRegistry.s.sol --private-key <PRIVATE_KEY> --rpc-url http://127.0.0.1:8545 --broadcast
forge script script/DeployCrowdfunding.s.sol --private-key <PRIVATE_KEY> --rpc-url http://127.0.0.1:8545 --broadcast
```

### 3. Update Frontend Contract Addresses

Edit `frontend/src/contracts/addresses.js` with the deployed addresses.

### 4. Start Frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 5. Configure MetaMask

- Network: Localhost 31337
- RPC: http://127.0.0.1:8545
- Chain ID: 31337
- Import test accounts from Anvil

---

## 🛠️ Key Features

- MetaMask wallet connection
- Admin-approved KYC for campaign creators
- Campaign creation, funding, and withdrawal
- Admin dashboard for KYC management
- Responsive UI with dark mode

---

## 🧪 Testing Flow

1. Connect wallet
2. Submit KYC (User)
3. Approve KYC (Admin)
4. Create campaign (User)
5. Contribute ETH (Other User)
6. Withdraw funds (Campaign Creator)

---

## 🐛 Troubleshooting

- **MetaMask not connecting?** Check network is Localhost 31337
- **Transaction failing?** Ensure Anvil is running
- **KYC not showing?** Use admin account
- **Page blank?** Check console for errors

---

## 👨‍💻 Developer

**Hassan Murtaza**

---

## 📄 License

MIT License - Free for learning and development.
