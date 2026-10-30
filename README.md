# ExpiryMate

> **Never miss an expiry date.**

**ExpiryMate** is a decentralized Web3 application built on the **Botchain Testnet** that allows users to record, track, and monitor expiry dates of important personal items (such as passports, warranties, subscriptions, and licences) securely on the blockchain.

---

## 🌟 Key Features

* **100% On-Chain Storage:** All records are stored directly on the Botchain smart contract with zero centralized database or backend dependencies.
* **Wallet-Bound Ownership:** Users view and manage only their own records. Records can only be deleted by the wallet that created them.
* **Real-Time Dynamic Countdowns:** Live countdown timers compute remaining days and time until expiration, updating automatically while the app is open.
* **Color-Coded Status Badges:**
  * 🟢 **Green (> 30 days):** Safe, plenty of time remaining.
  * 🟡 **Yellow (≤ 30 days):** Expiring soon, needs attention.
  * 🔴 **Red (Expired):** Item has passed its expiration date.
* **Privacy By Design:** A prominent on-chain notice reminding users to only store brief descriptive labels (e.g., "Passport", "Driver's Licence") and **never** store sensitive identification numbers, passport numbers, or personal documents.
* **Minimalist Premium Interface:** Designed with a dark charcoal background, muted purple and green accents, smooth cards, and subtle animations.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide Icons
* **Web3 Integration:** wagmi v2, viem v2, TanStack Query, MetaMask / Injected Web3 Connectors
* **Smart Contract & Tooling:** Solidity `^0.8.20`, Hardhat, ethers.js v6, Chai / Mocha test suite

---

## 🌐 Blockchain Network Details

* **Network Name:** Botchain Testnet
* **Chain ID:** `968`
* **RPC URL:** `https://rpc.bohr.life`
* **Currency Symbol:** `BOHR`
* **Block Explorer:** [https://scan.bohr.life](https://scan.bohr.life)

---

## 📑 Smart Contract: `ExpiryMate.sol`

The contract is located in `contracts/ExpiryMate.sol` and provides:

* `addRecord(string name, uint256 expiryDate)`: Validates that the name is not empty and that the expiry date is in the future, then stores the record associated with `msg.sender`.
* `deleteRecord(uint256 recordId)`: Allows the owner to delete their record (marks it as deleted and emits an event).
* `getMyRecords()`: Returns an array of all active (non-deleted) records for the connected wallet (`msg.sender`).
* `getRecordCount(address user)`: Returns the number of active records belonging to an address.
* `getRecord(uint256 recordId)`: Fetches a single record by ID.

---

## 🚀 Getting Started

### 1. Prerequisites

* **Node.js** v18+ (tested on Node v20/v25)
* **npm** or package manager of choice
* **MetaMask** browser extension configured for Botchain Testnet (Chain ID `968`)

### 2. Installation

```bash
# Clone the repository
git clone <repo-url>
cd ExpiryMate

# Install dependencies
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Inside `.env.local`:
```env
# Optional: Private key of the deployer wallet (funded with Botchain testnet BOHR)
PRIVATE_KEY=your_private_key_here

# Deployed contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

---

## 🧪 Smart Contract Compilation & Testing

To compile the contract:
```bash
npm run compile
```

To run the comprehensive test suite (covers adding records, validation, permissions, and deletions):
```bash
npm test
```

---

## 🚢 Deploying to Botchain Testnet

1. Ensure your deployer wallet on Botchain Testnet has some testnet BOHR.
2. Set `PRIVATE_KEY` in your `.env` or `.env.local`.
3. Run the deployment script:
```bash
npm run deploy:botchain
```
4. The deployment script will output the deployed contract address and automatically save the deployment information in `src/config/deployment.json`.
5. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local` with this address.

---

## 💻 Running the Frontend

Start the Next.js local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

1. Click **Connect Wallet** in the top navigation.
2. Ensure MetaMask is connected to **Botchain Testnet (968)**. The app will prompt you to switch if you are on another network.
3. Enter an item name and select an expiry date in the future.
4. Click **Save Record** to submit the transaction to the blockchain.
5. Watch the dashboard update live with real-time countdowns!

---

## 🔒 Privacy Notice

> **Note:** Data stored on any public blockchain is publicly visible and immutable. Never save sensitive numbers (e.g. social security numbers, passport numbers, credit card numbers, passwords) on-chain. Only use general descriptive labels.

---

## 📄 License

MIT
