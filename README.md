# Obscura Finance

**Confidential RWA Deal Rooms for sealed private credit funding.**

Obscura Finance is a confidential deal room where investors submit sealed bids, allocations stay hidden, repayments settle onchain, and auditors verify details through permissioned disclosure. The MVP demonstrates a practical private credit funding flow with iExec Nox Confidential Tokens.

## Why confidential RWA funding
Private credit and RWA funding require onchain settlement, but investors cannot expose bid size, allocation, or repayment exposure publicly. Obscura Finance keeps allocations private by default and enables auditors to view sensitive details only when permissioned.

## What works end-to-end
- Issuer creates a deal with metadata (sample metadata only).
- Funding state progresses onchain: Open → Funding → Funded → Repaid → Claimed.
- Investors approve confidential token transfers and submit sealed bids.
- Bid amounts stay hidden in the UI; only the investor and authorized auditor can view their bid details.
- Issuer repays onchain, investors claim repayment.
- Auditor access is permissioned onchain.
- Explorer links for every transaction.

## iExec Nox usage
- Confidential funding is handled via a Confidential Token deployed through iExec Nox.
- The app reads balances and transfers confidential tokens for bids and repayment.
- Auditor disclosure is enforced at the contract level with permissioned access checks.

## Tech stack
- Next.js + TypeScript + Tailwind CSS
- wagmi + viem
- Hardhat
- Arbitrum Sepolia

## Project structure
- `src/app`: UI routes (Landing, Issuer, Investor, Auditor, Demo)
- `src/components`: UI, deal actions, and wallet components
- `contracts`: Obscura deal room contract
- `scripts`: deployment scripts

## Local setup
```bash
npm install
```

Create `.env` from the example:
```bash
cp .env.example .env
```

Set:
- `NEXT_PUBLIC_RPC_URL` (optional)
- `ARB_SEPOLIA_RPC_URL`
- `DEPLOYER_PRIVATE_KEY`
- `CONFIDENTIAL_TOKEN_ADDRESS`
- `NEXT_PUBLIC_DEAL_ROOM_ADDRESS`
- `NEXT_PUBLIC_CONFIDENTIAL_TOKEN_ADDRESS`

## Compile contracts
```bash
npm run compile:contracts
```

## Deploy (Arbitrum Sepolia)
```bash
npm run deploy:arb
```

Copy the deployed deal room address into `NEXT_PUBLIC_DEAL_ROOM_ADDRESS`.

## Run the app
```bash
npm run dev
```

## Demo flow (under 4 minutes)
1. Connect wallet.
2. Ensure you have a Confidential Token on Arbitrum Sepolia.
3. Issuer creates a deal.
4. Issuer opens funding.
5. Investor approves confidential token and submits sealed bid.
6. Issuer marks the deal funded, then repays.
7. Investor claims repayment.
8. Issuer grants auditor access.
9. Auditor views permissioned disclosure via Auditor Lookup.

## Contract addresses
- Obscura Deal Room (Arbitrum Sepolia): `TBD`
- Confidential Token (Arbitrum Sepolia): `TBD`

## Sample metadata vs real state
- **Sample metadata only:** title, category, description, document hash.
- **Real onchain state:** deals, bids, repayments, claims, transaction hashes.

## Known limitations
- This MVP treats confidential token transfers as standard ERC-20 transfers; use an iExec Confidential Token deployment on Arbitrum Sepolia.
- Bid commitment generation is left to the investor (use a hash of offchain terms).
- No advanced allocation logic or interest schedules yet.

## License
MIT
