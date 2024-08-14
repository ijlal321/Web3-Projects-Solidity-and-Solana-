# BankAccount Smart Contract

## Overview

The `BankAccount` smart contract is a multi-owner bank account system that allows multiple users to manage and operate a shared account on the Ethereum blockchain. The contract facilitates account creation, deposits, withdrawal requests, and approvals, with a focus on security and shared ownership.

**Deployed Network:** Sepolia  
**Contract Address:** `0xf03F6E2c37a7F9F8034dD062B0Be3d95d43F67A9`
**See Live Version:** [Live Preview](https://ijlal321.github.io/Web3-Projects-Solidity-and-Solana-/Joint%20Bank%20Account/client/dist/)
## Features

- **Multi-Owner Accounts:** Each account can have up to 4 owners.
- **Deposits:** Owners can deposit Ether into the account.
- **Withdrawal Requests:** Owners can request withdrawals from the account balance.
- **Approval System:** Withdrawals require approval from other account owners before they can be executed.
- **Multiple Accounts per User:** Each user can be part of up to 3 accounts.

## Account Creation

To create an account, a user must call the `createAccount` function and provide a list of other owners. The following conditions must be met:

1. The total number of owners (including the creator) must not exceed 4.
2. Each owner must be unique; no duplicates are allowed.
3. A user can participate in a maximum of 3 accounts.

Upon successful creation, an account ID is assigned, and all owners are registered with the account.

## Deposits

Owners can deposit Ether into the account by calling the `deposit` function and specifying the account ID. The Ether is added to the account balance and can be used for future withdrawals.

## Withdrawal Process

### Requesting a Withdrawal

To request a withdrawal, an owner must call the `requestWithdrawl` function with the desired account ID and amount. The following conditions must be met:

1. The requester must be an owner of the account.
2. The account must have sufficient balance to cover the requested amount.

A withdrawal request ID is generated, and the request is recorded in the contract.

### Approving a Withdrawal

Other owners must approve the withdrawal request by calling the `approveWithdrawl` function. The following conditions must be met:

1. The approver must be an owner of the account.
2. The approver must not be the one who initiated the request.
3. The approver must not have already approved the request.

If all owners (excluding the requester) approve the withdrawal, the request is marked as approved.

### Executing a Withdrawal

Once the withdrawal request is approved, the requester can call the `withdraw` function to execute the withdrawal. The following conditions must be met:

1. The requester must be the one who initiated the withdrawal request.
2. The request must have been approved.

The specified amount of Ether is transferred to the requester's address, and the account balance is updated.

## Utility Functions

- **getBalance(accountId):** Returns the current balance of the specified account.
- **getOwners(accountId):** Returns the list of owners for the specified account.
- **getApprovals(accountId, withdrawId):** Returns the number of approvals for a specified withdrawal request.
- **getAccounts():** Returns a list of account IDs that the caller is a part of.

## Events

- **AccountCreated:** Emitted when a new account is created, with the owners, account ID, and timestamp.
- **Deposit:** Emitted when a deposit is made, with the user, account ID, value, and timestamp.
- **WithdrawRequested:** Emitted when a withdrawal is requested, with the user, account ID, withdrawal ID, amount, and timestamp.
- **Withdraw:** Emitted when a withdrawal is executed, with the withdrawal ID and timestamp.

## Conclusion

The `BankAccount` contract provides a secure and collaborative way for multiple users to manage shared funds on the Ethereum blockchain. With its multi-owner approval system, it ensures that funds can only be withdrawn with consensus among account owners, enhancing security and trust.

