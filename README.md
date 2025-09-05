# Digital Wallet API

## Project Overview

The **Digital Wallet API** is a secure, modular, and role-based backend system (similar to **bKash** or **Nagad**) built with **Express.js** and **Mongoose**.

It provides core features such as **user and agent registration, wallet management, money transfers, withdrawals, and transaction history tracking**.

The system is designed with:

- Authentication & Role-based Authorization
- Wallet Management
- Transaction Handling
- Modular Code Architecture
- Well-defined API Endpoints

---

## Implemented Functional Requirements

### Authentication & Authorization

- JWT-based login system
- Three roles: `admin`, `user`, `agent`
- Secure password hashing using **bcrypt**

### Wallet Management

- Automatic wallet creation for each `user` and `agent` during registration (with an initial balance of **৳50**)

### User Functionalities

- Add money (top-up)
- Withdraw money
- Send money to another user
- View transaction history

### Agent Functionalities

- Add money to any user's wallet (cash-in)
- Withdraw money from any user's wallet (cash-out)

### Admin Functionalities

- View all users, agents, wallets, and transactions
- Block/unblock user wallets
- Approve/suspend agents

### Transaction Management

- All transactions are stored and trackable
- Role-based route protection is enforced

---

# API Endpoints

This document lists all API endpoints of the `Digital Wallet API`.  
Role-Based Access Control (RBAC) is applied, so only users with the appropriate role can access the endpoints.

---

## Auth Routes

| Method | Endpoint             | Description            | Access |
| ------ | -------------------- | ---------------------- | ------ |
| POST   | `/api/v1/auth/login` | User/Agent/Admin login | Public |

---

## User Routes

| Method | Endpoint                  | Description                   | Access |
| ------ | ------------------------- | ----------------------------- | ------ |
| POST   | `/api/v1/user/register`   | Register new User or Agent    | Public |
| GET    | `/api/v1/user`            | Get all users                 | Admin  |
| PATCH  | `/api/v1/user/:id/status` | Approve or suspend User/Agent | Admin  |

---

## Wallet Routes

| Method | Endpoint                    | Description                        | Access      |
| ------ | --------------------------- | ---------------------------------- | ----------- |
| GET    | `/wallet`                   | Get all wallets                    | Admin       |
| POST   | `/api/v1/wallet/withdraw`   | Withdraw money from wallet         | User, Agent |
| POST   | `/api/v1/wallet/send-money` | Send money to another user         | User        |
| POST   | `/api/v1/wallet/add-money`  | Add money to user wallet (cash-in) | Agent       |
| PATCH  | `/api/v1/wallet/:id/block`  | Block or unblock a wallet          | Admin       |

---

## Transaction Routes

| Method | Endpoint                              | Description                        | Access      |
| ------ | ------------------------------------- | ---------------------------------- | ----------- |
| GET    | `/api/v1/transaction`                 | Get all transactions               | Admin       |
| GET    | `/api/v1/transaction/my-transactions` | Get transactions of own user/agent | User, Agent |

---

## Tech Stack

- **Node.js** + **Express.js** (Backend Framework)
- **MongoDB** + **Mongoose** (Database & ODM)
- **Zod** (Request Validation)
- **JWT** (Authentication)
- **Bcrypt** (Password Hashing)
- **TypeScript** (Strong Typing)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/digital-wallet-api.git
cd digital-wallet-api
```
