# iExec Nox / Confidential Token Feedback

## What worked well
- The concept of Confidential Tokens maps cleanly to private credit and sealed bid flows.
- Nox positioning around confidential smart contracts is a strong fit for RWA funding.

## What was hard
- Finding concrete contract interfaces and integration examples for Confidential Tokens.
- Navigating between different documentation pages to locate deployable testnet contracts.

## Documentation feedback
- Provide a dedicated “Confidential Token for Solidity” page with ABI, examples, and testnet addresses.
- Include a complete end-to-end flow: wrap → transfer → balance read → permissioned disclosure.

## Developer experience feedback
- Provide SDK snippets for wagmi/viem to reduce integration time.
- Add a quickstart repository focused on confidential token transfers + a simple funding contract.

## Ideas for improving Confidential Token tooling
- A standard ABI package published to npm (e.g., `@iexec/confidential-token-abi`).
- A sandbox faucet + demo dApp on Arbitrum Sepolia with a reference Confidential Token deployment.
- A sample sealed-bid component that outputs commitments and encrypted payloads.
