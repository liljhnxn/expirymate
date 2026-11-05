# ExpiryMate

> **Never miss an expiry date.**

**ExpiryMate** is a decentralized Web3 application built on **BOT Chain** that allows users to record, track, and monitor expiry dates of important personal items (such as passports, warranties, subscriptions, and licences) securely on the blockchain.

---

## 🌟 Key Features

* **100% On-Chain Storage:** All records are stored directly on the BOT Chain smart contract with zero centralized database or backend dependencies.
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

## 🌐 BOT Chain Official Ecosystem Details

* **BOT Chain Website:** [https://botchain.ai](https://botchain.ai)
* **BOT Chain Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)
* **Network Name:** BOT Chain
* **Chain ID:** `677`
* **RPC URL:** `https://rpc.botchain.ai`
* **Currency Symbol:** `BOT`
* **Deployed & Verified Contract:** [`0xbDcBdb48271D430f3051bABA75934fB928A61171`](https://scan.botchain.ai/address/0xbDcBdb48271D430f3051bABA75934fB928A61171#code)

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
* **MetaMask** browser extension configured for BOT Chain (Chain ID `677`)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/liljhnxn/expirymate.git
cd expirymate

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
# Optional: Private key of the deployer wallet (funded with BOT Chain BOT)
PRIVATE_KEY=your_private_key_here

# Deployed contract address on BOT Chain
NEXT_PUBLIC_CONTRACT_ADDRESS=0xbDcBdb48271D430f3051bABA75934fB928A61171
NEXT_PUBLIC_CHAIN_ID=677
NEXT_PUBLIC_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_EXPLORER_URL=https://scan.botchain.ai
NEXT_PUBLIC_BOTCHAIN_URL=https://botchain.ai
```

---

## 🧪 Smart Contract Compilation & Testing

To compile the contract:
```bash
npm run compile
```

To run the comprehensive test suite:
```bash
npm test
```

---

## 🚢 Deploying to BOT Chain

To deploy to BOT Chain:
```bash
npm run deploy
```

---

## 💻 Running the Frontend

Start the Next.js local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

1. Click **Connect Wallet** in the top navigation.
2. Ensure MetaMask is connected to **BOT Chain (677)**.
3. Enter an item name and select an expiry date in the future.
4. Click **Save Record** to submit the transaction to the blockchain.

---

## 🔒 Privacy Notice

> **Note:** Data stored on any public blockchain is publicly visible and immutable. Never save sensitive numbers (e.g. social security numbers, passport numbers, credit card numbers, passwords) on-chain. Only use general descriptive labels.

---

## 📄 License

MIT
