# ExpiryMate Whitepaper & Pitch Deck
**Tagline:** Never miss an expiry date.  
**Network:** Botchain Mainnet (Chain ID: `677`)  
**Smart Contract:** [`0xbDcBdb48271D430f3051bABA75934fB928A61171`](https://scan.botchain.ai/address/0xbDcBdb48271D430f3051bABA75934fB928A61171)  
**Repository:** [https://github.com/liljhnxn/expirymate](https://github.com/liljhnxn/expirymate)  
**Version:** 1.1.0 — November 2026  

---

## 1. Executive Summary

**ExpiryMate** is a decentralized, non-custodial application (dApp) built on the **Botchain** blockchain designed to solve a universal problem: tracking the expiration dates of critical personal and business items—including passports, driver's licences, product warranties, insurance policies, and software subscriptions—without compromising privacy or relying on centralized databases.

Traditional expiration-tracking software relies on centralized database silos, requiring invasive user accounts, emails, and sensitive data uploads that are susceptible to breaches, platform obsolescence, and subscription paywalls. ExpiryMate reimagines expiry tracking as a trustless on-chain utility: users retain cryptographic ownership of their tracking records, monitor real-time expiration countdowns, and execute immutable updates directly through their Web3 wallets.

---

## 2. Problem Statement

Every individual and business manages dozens of time-sensitive documents and assets. Forgetting an expiration date leads to severe consequences:
- **Travel disruptions & legal penalties:** Expired passports or driving licences.
- **Financial loss:** Lapsed warranties or forgotten auto-renewing subscriptions.
- **Administrative overhead:** Disjointed tracking systems across spreadsheets, physical paperwork, and disparate reminder apps.

### Flaws of Current Web2 Solutions:
1. **Centralized Data Vulnerability:** Web2 apps often ask users to upload scan photos or document numbers. A breach leaks highly sensitive Personally Identifiable Information (PII).
2. **Platform Lock-In & Obsolescence:** If a commercial reminder app shuts down or introduces aggressive paywalls, user records are lost or held hostage.
3. **Account Fatigue:** Forcing email logins, password managers, and spam-heavy notification systems for simple record-keeping.

---

## 3. The ExpiryMate Solution

ExpiryMate bridges everyday utility with blockchain security:

* **100% On-Chain Durability:** Records are permanently stored on the Botchain ledger. As long as the blockchain operates, your records remain accessible.
* **Privacy-by-Design Paradigm:** The smart contract requires only a general descriptive label (e.g., *"Passport"*, *"Gym Pass"*) and a Unix expiration timestamp. **Zero sensitive PII, document numbers, or images are ever stored on-chain.**
* **Cryptographic Self-Sovereignty:** Records are strictly mapped to the creator's wallet address (`msg.sender`). Only the creator wallet can view and delete its records.
* **Autonomous Live Countdowns:** Frontend countdown algorithms dynamically update without periodic server roundtrips, categorizing records into color-coded urgency states.

---

## 4. Product Highlights & User Experience

| Feature | Description |
| :--- | :--- |
| **Instant Wallet Onboarding** | Connect with MetaMask / Injected Web3 wallets in one click. No registration, email, or passwords. |
| **Simple Record Creation** | Enter an item name, select a future date, and confirm the on-chain transaction. |
| **Live Visual Status** | 🟢 **Safe (>30 days):** Green accent.<br>🟡 **Expiring Soon (≤30 days):** Amber caution badge.<br>🔴 **Expired:** Crimson badge with instant action prompt. |
| **Owner-Only Deletion** | Cleanly purge expired or obsolete items on-chain with single-click confirmation. |
| **Minimalist Aesthetic** | Premium dark charcoal interface with muted purple & emerald accents, built for high legibility and low cognitive load. |

---

## 5. System Architecture & Technical Specifications

```
  +-------------------------------------------------------------+
  |                      CLIENT BROWSER                         |
  |  Next.js 14 (App Router) + TypeScript + Tailwind CSS        |
  |  wagmi v2 + viem v2 + TanStack Query                       |
  +------------------------------+------------------------------+
                                 |
                          JSON-RPC (HTTPS)
                                 |
                                 v
  +-------------------------------------------------------------+
  |                    BOTCHAIN TESTNET                         |
  |  Chain ID: 968  |  RPC: https://rpc.bohr.life               |
  |                                                             |
  |  +-------------------------------------------------------+  |
  |  |            ExpiryMate.sol (Smart Contract)            |  |
  |  |  * addRecord(string name, uint256 expiryDate)         |  |
  |  |  * deleteRecord(uint256 recordId)                     |  |
  |  |  * getMyRecords() -> Record[]                         |  |
  |  |  * getRecordCount(address user) -> uint256            |  |
  |  +-------------------------------------------------------+  |
  +-------------------------------------------------------------+
```

### Smart Contract Implementation:
* **Contract Language:** Solidity `^0.8.20`
* **EVM Target:** Paris
* **Gas Optimizations:** Storage-efficient packing, internal index mappings, and zero loop mutations on state.
* **Security Controls:**
  * Reverts empty string inputs (`bytes(name).length > 0`).
  * Reverts past/current timestamps (`expiryDate > block.timestamp`).
  * Enforces caller ownership on deletion (`record.owner == msg.sender`).
  * Emits indexed events (`RecordAdded`, `RecordDeleted`) for indexer compatibility.

---

## 6. Value Proposition for the Botchain Ecosystem

1. **Everyday Consumer Utility:** Moves Web3 beyond pure speculation into daily practical utility, attracting non-DeFi users to Botchain.
2. **Transaction Velocity & Gas Utilization:** Encourages regular micro-transactions on Botchain as users log, renew, and maintain life records.
3. **Showcase of Botchain Speed & Low Fees:** High-frequency, lightweight consumer dApps thrive on Botchain's responsive block times and negligible gas costs compared to Ethereum mainnet.

---

## 7. Roadmap & Future Innovations

### Phase 1: MVP & Mainnet Deployment (Current)
- [x] Solidity smart contract deployed and verified on Botchain Testnet.
- [x] Complete Next.js frontend with Wagmi v2 & live countdown engine.
- [x] GitHub repository open-sourced with full test suite.

### Phase 2: Decentralized Notifications (Q1 2027)
- Integration with decentralized messaging protocols (e.g., XMTP or Push Protocol) to send opt-in, privacy-preserving wallet-to-wallet alerts before expiry deadlines.

### Phase 3: Account Abstraction & Gasless Tracking (Q2 2027)
- ERC-4337 smart accounts enabling social logins and sponsored gas, allowing mainstream users to track items with zero crypto onboarding hurdles.

---

## 8. Official Links & Verification

* **Live GitHub Repository:** [https://github.com/liljhnxn/expirymate](https://github.com/liljhnxn/expirymate)
* **Verified Contract on BohrScan:** [0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2](https://scan.bohr.life/address/0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2#code)
* **Chain ID:** 968
* **RPC URL:** `https://rpc.bohr.life`
* **Explorer:** `https://scan.bohr.life`

---

*© 2026 ExpiryMate. Open source under the MIT License.*
