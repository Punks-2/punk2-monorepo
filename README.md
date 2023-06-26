# nouns-monorepo

Nouns DAO is a generative avatar art collective run by a group of crypto misfits.

## Contributing

If you're interested in contributing to Nouns DAO repos we're excited to have you. Please discuss any changes in `#developers` in [discord.gg/nouns](https://discord.gg/nouns) prior to contributing to reduce duplication of effort and in case there is any prior art that may be useful to you.

## Packages

### punks-api

The [punks api](packages/punks-api) is an HTTP webserver that hosts token metadata. This is currently unused because on-chain, data URIs are enabled.

### nouns-assets

The [nouns assets](packages/nouns-assets) package holds the Noun PNG and run-length encoded image data.

### punks-bots

The [punks bots](packages/punks-bots) package contains a bot that monitors for changes in Punks auction state and notifies everyone via Twitter and Discord.

### nouns-contracts

The [nouns contracts](packages/nouns-contracts) is the suite of Solidity contracts powering Nouns DAO.

### punks-sdk

The [punks sdk](packages/punks-sdk) exposes the Punks contract addresses, ABIs, and instances as well as image encoding and SVG building utilities.

### punks-subgraph

In order to make retrieving more complex data from the auction history, [punks subgraph](packages/punks-subgraph) contains subgraph manifests that are deployed onto [The Graph](https://thegraph.com).

### punks-webapp

The [punks webapp](packages/punks-webapp) is the frontend for interacting with Punks auctions as hosted at [nouns.wtf](https://nouns.wtf).

## Quickstart

### Install dependencies

```sh
yarn
```

### Build all packages

```sh
yarn build
```

### Run Linter

```sh
yarn lint
```

### Run Prettier

```sh
yarn format
```
