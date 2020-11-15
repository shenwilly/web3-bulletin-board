# web3-bulletin-board (Web3BB)

A decentralised bulletin board powered by [3Box](https://github.com/3box/) (DB) & [Kleros TCRs](https://github.com/kleros/) (Crowd content moderation).

## Project setup
```
yarn
yarn serve
```

### How to Use
1. Install Metamask extension and set to Kovan.
2. Connect to post messages.
3. Apply as moderator for post reporting privilege.

### Limitations
1. Report feature for moderators only on the UI level (Anyone can submit directly to the Blocked Posts TCR).
2. Hard-coded juror fees

### TCRs (Kovan)
- [Moderators TCR](https://curate.kleros.io/tcr/0xbC981A7A4cd9eA2dE0b7e2192b1d2ce25e3B7263)
- [Blocked Posts TCR](https://curate.kleros.io/tcr/0xEE66D42489C4624F70dc28aE2D0a7a1cE698c77C)
