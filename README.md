# Akuntabel

Akuntabel is a web3 goal app that allows you to create, track, and achieve your
goals with a help of community for accountability.

## Features

🎯 Goal Creation: Users can create new goals with a description, set a stake,
and invite judges to approve the goal.

🏆 Milestones: Goals can be broken down into milestones, which users can mark as
achieved.

✅ Approval Process: Once all milestones are achieved, the goal must be approved
by the required number of judges before the funds are released.

💰 Funds Release: When a goal is approved, the staked funds are automatically
released to the user.

👥 Accountability: The community of judges helps hold users accountable for
achieving their goals.

## Links

- Live Demo: [https://akuntabel.vercel.app/](https://akuntabel.vercel.app/)
- Smart Contract:
  [https://sepolia.etherscan.io/address/0x64d4b23b0cbae104d5461558d9eb8e60d07d2735#code](https://sepolia.etherscan.io/address/0x64d4b23b0cbae104d5461558d9eb8e60d07d2735#code)

## Tech Stack

This project is build with Scaffold-ETH 2
([https://scaffoldeth.io](https://scaffoldeth.io/)) as the base with the
following tech stack:

### Frontend

- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS (with DaisyUI)
- React Hook Form
- RainbowKit (for wallet connections)
- Wagmi (for Ethereum interactions)
- Viem (for Ethereum interactions)

### Blockchain

- Ethereum
- Sepolia testnet (as the target network)
- Hardhat (Ethereum development environment)
- Solidity (for smart contracts)

### Testing

- Hardhat for contract testing

### Development Tools

- Yarn (package manager)
- ESLint (for linting)
- Prettier (for code formatting)

### Deployment

- Vercel (for frontend deployment)

### Other Libraries and Tools

- OpenZeppelin Contracts
- nprogress (for progress bar)
- react-hot-toast (for notifications)

## Development

### Prerequisites

To work on this project, you need to have yarn installed. You can install it by
running the following command:

```bash
npm install -g yarn
```

After that, you can install the dependencies by running the following command:

```bash
yarn install
```

### Local Blockchain

> [!IMPORTANT] IMPORTANT
>
> To work on the project on a local blockchain you need to change the scaffold
> eth config to use the local hardhat network. You can do this by editing the
> `packages/nextjs/scaffold.config.ts` file. And change the `targetNetwork` to
> `chains.hardhat`

Start the local hardhat network by running the following command:

```bash
yarn chaian
```

After that open a new terminal **and** start the frontend development server by
running the following command:

```bash
yarn start
```

> [!TIP] Tip
>
> The project is a monorepo managed with yarn workspaces. Check the
> `package.json` for the bootstraped commands.
>
> - The `/packages/nextjs` is the frontend part of the project.
> - The `/packages/hardhat` is the ethereum project for smart contract works.
