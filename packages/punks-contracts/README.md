# @punks/contracts

## Background

Punks are an experimental attempt to improve the formation of on-chain avatar communities. While projects such as CryptoPunks have attempted to bootstrap digital community and identity, Nouns attempt to bootstrap identity, community, governance and a treasury that can be used by the community for the creation of long-term value.

One Punk is generated and auctioned every day, forever. All Punk artwork is stored and rendered on-chain. See more information at [nouns.wtf](https://nouns.wtf/).

## Contracts

| Contract                                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Address                                                                                                               |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [NounsToken](./contracts/NounsToken.sol)                        | This is the Nouns ERC721 Token contract. Unlike other Nouns contracts, it cannot be replaced or upgraded. Beyond the responsibilities of a standard ERC721 token, it is used to lock and replace periphery contracts, store checkpointing data required by our Governance contracts, and control Noun minting/burning. This contract contains two main roles - `minter` and `owner`. The `minter` will be set to the Nouns Auction House in the constructor and ownership will be transferred to the Nouns DAO following deployment.                                                                                                    | [0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03) |
| [NounsSeeder](./contracts/NounsSeeder.sol)                      | This contract is used to determine Noun traits during the minting process. It can be replaced to allow for future trait generation algorithm upgrades. Additionally, it can be locked by the Nouns DAO to prevent any future updates. Currently, Noun traits are determined using pseudo-random number generation: `keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))`. Trait generation is not truly random. Traits can be predicted when minting a Noun on the pending block.                                                                                                                                          | [0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515](https://etherscan.io/address/0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515) |
| [NounsDescriptor](./contracts/NounsDescriptor.sol)              | This contract is used to store/render Noun artwork and build token URIs. Noun 'parts' are compressed in the following format before being stored in their respective byte arrays: `Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][]`. When `tokenURI` is called, Noun parts are read from storage and converted into a series of SVG rects to build an SVG image on-chain. Once the entire SVG has been generated, it is base64 encoded. The token URI consists of base64 encoded data URI with the JSON contents directly inlined, including the SVG image. | [0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63](https://etherscan.io/address/0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63) |
| [NounsAuctionHouse](./contracts/NounsAuctionHouse.sol)          | This contract acts as a self-sufficient noun generation and distribution mechanism, auctioning one noun every 24 hours, forever. 100% of auction proceeds (ETH) are automatically deposited in the Nouns DAO treasury, where they are governed by noun owners. Each time an auction is settled, the settlement transaction will also cause a new noun to be minted and a new 24 hour auction to begin. While settlement is most heavily incentivized for the winning bidder, it can be triggered by anyone, allowing the system to trustlessly auction nouns as long as Ethereum is operational and there are interested bidders.       | [0xF15a943787014461d94da08aD4040f79Cd7c124e](https://etherscan.io/address/0xF15a943787014461d94da08aD4040f79Cd7c124e) |
| [NounsDAOExecutor](./contracts/governance/NounsDAOExecutor.sol) | This contract is a fork of Compound's `Timelock`. It acts as a timelocked treasury for the Nouns DAO. This contract is controlled by the governance contract (`NounsDAOProxy`).                                                                                                                                                                                                                                                                                                                                                                                                                                                         | [0x0BC3807Ec262cB779b38D65b38158acC3bfedE10](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10) |
| [NounsDAOProxy](./contracts/governance/NounsDAOProxy.sol)       | This contract is a fork of Compound's `GovernorBravoDelegator`. It can be used to create, vote on, and execute governance proposals.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | [0x6f3E6272A167e8AcCb32072d08E0957F9c79223d](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d) |
| [NounsDAOLogicV1](./contracts/governance/NounsDAOLogicV1.sol)   | This contract is a fork of Compound's `GovernorBravoDelegate`. It's the logic contract used by the `NounsDAOProxy`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | [0xa43aFE317985726E4e194eb061Af77fbCb43F944](https://etherscan.io/address/0xa43aFE317985726E4e194eb061Af77fbCb43F944) |

## Development

### Environment Addresses

| Contract              | Chain   | Address                                    |
|-----------------------|---------|--------------------------------------------|
| CryptopunksVote       | Mainnet | 0x28b50f3e79b4921146ee7dfD18FB3Ea61294617b |
| CryptopunksVote       | Goerli  | 0x5CC68fCb6B18eb05d7008330191494e9ecAd948F |
| CryptopunksVote       | Goerli  | 0x4C92061D1Ab6768F8267E7BC10c516CBA4c85b99 |
| WrappedPunk (mock)    | Goerli  | 0xDE513f5783C86D71501b4fC6cCD16e0Ecd6D3230 |
| OG Cryptopunks (mock) | Goerli  | 0x85B353Ba06d16a237F24CB370ea291972F9bDd42 |
| OG Cryptopunks (mock) | Sepolia | 0x8316d3Ba5ffF588ED37263906Cac45E9cB44e014 |
| WrappedPunk (mock)    | Sepolia | 0xde3be40B3e81d1BEd035bEA3f265DE07e3FB942A |
| CryptopunksVote       | Sepolia | 0x225EB996209af94F45Bd71c35fDB032feF96b8e4 |
| OG Cryptopunks (mock) | Goerli  | 0x85B353Ba06d16a237F24CB370ea291972F9bDd42 |
| CryptopunksVote (old) | Goerli  | 0xfabd98b4976620ee2bc79641126c734fc49e2c81 |

### Install dependencies

```sh
yarn
```

### Compile typescript, contracts, and generate typechain wrappers

```sh
yarn build
```

### Run tests

```sh
yarn test
```

### Install forge dependencies

```sh
forge install
```

### Run forge tests

```sh
forge test -vvv
```

### Environment Setup

Copy `.env.example` to `.env` and fill in fields

### Commands

```sh
# Compile Solidity
yarn build:sol

# Command Help
yarn task:[task-name] --help

# Deploy & Configure for Local Development (Hardhat)
yarn task:run-local

# Deploy & Configure (Testnet/Mainnet)
# This task deploys and verifies the contracts, populates the descriptor, and transfers contract ownership.
# For parameter and flag information, run `yarn task:deploy-and-configure --help`.
yarn task:deploy-and-configure --network goerli --update-configs --start-auction --auto-deploy
yarn task:deploy-and-configure --network hardhat --update-configs --start-auction --auto-deploy --weth "0x387d301d92AE0a87fD450975e8Aef66b72fBD718"
```

### Automated Testnet Deployments

The contracts are deployed to Rinkeby on each push to master and each PR using the account `0x387d301d92AE0a87fD450975e8Aef66b72fBD718`. This account's mnemonic is stored in GitHub Actions as a secret and is injected as the environment variable `MNEMONIC`. This mnemonic _shouldn't be considered safe for mainnet use_.

## Testing images locally

```shell
yarn hardhat run-local
```

```shell
yarn hardhat generate-metadata --network localhost
```

```shell
yarn hardhat deploy-and-configure --network goerli --start-auction --auto-deploy --auction-duration 1200
yarn hardhat deploy-and-configure --network goerli --start-auction --auto-deploy --proposal-threshold-bps 1 --quorum-votes-bps 200
yarn hardhat deploy-and-configure --network mainnet --auto-deploy --proposal-threshold-bps 1 --quorum-votes-bps 200 --punkers '0xcfbF2E7005d4f204392929c993281Ec99E61c5a7'
yarn hardhat register-og-punks --network goerli --n-token-address '0x0Fa9939b3C4D73AdC288b19750Fb9f68130A21a0'
yarn hardhat register-og-punks --network mainnet --n-token-address '0x83797D8608aA53dFcC77D350081383dF021ee5Bc'
```
