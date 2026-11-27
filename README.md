# FinCore
### Digital Wallet, Ledger & Payment Processing Platform

**A full-stack fintech application demonstrating digital wallet management, secure customer authentication, ledger-based transactions, and simulated payment processing.**

---

## 1. Project Overview

FinCore is a full-stack digital finance platform developed to simulate essential operations of a modern digital wallet and payment processing system.

The platform enables customers to register, securely log in, manage wallets, maintain beneficiaries, transfer simulated funds, review transaction histories and statements, and raise disputes.

It also provides an operations interface for staff-oriented financial activity review and dispute investigation.

The project focuses on applying practical software engineering concepts such as REST API development, relational database design, transaction management, authentication, customer data isolation, and responsive frontend development.

**Project type:** Full-Stack Fintech Application  
**Implementation scope:** Assessment Handbook Sections 1–8  
**Database:** PostgreSQL  
**Application:** Educational simulation — no real financial transactions.

## 2. Key Features

### Customer Management & Authentication
- Customer registration and login.
- Password hashing and secure credential handling.
- Database-backed session management.
- Logout and session invalidation.
- Customer-specific data access.
- Server-side authorization and customer data isolation.

### Digital Wallet Management
- Customer wallet/account information.
- Wallet balance visibility.
- Customer-linked account records.
- Database-backed account information.

### Beneficiary Management
- Add and view beneficiaries.
- Maintain beneficiary information.
- Associate beneficiary records with the relevant customer.

### Fund Transfers
- Simulated customer-to-customer fund transfers.
- Balance validation before processing.
- Insufficient-funds handling.
- Atomic transfer processing.
- Debit and credit ledger entries.
- Database-backed transfer records.

### Transaction Management
- Transaction history.
- Transaction record persistence.
- Ledger-based financial record tracking.
- Account balance updates through database logic.

### Dispute Management
- Raise and view transaction disputes.
- Store dispute information.
- Customer-specific dispute records.
- Operations-oriented dispute investigation support.

### Statements
- Access customer financial statement information.
- Review transaction-related financial records.

### Operations Interface
- Staff-oriented operations interface.
- Financial activity review.
- Dispute investigation support.

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Next.js, TypeScript |
| Styling | Tailwind CSS, CSS |
| Backend | Node.js, Express.js, TypeScript |
| Analytics Service | Python, FastAPI |
| Database | PostgreSQL |
| Database Driver | Node.js `pg` |
| Authentication | Password hashing, database-backed sessions |
| API Architecture | REST APIs |
| Containerization | Docker, Docker Compose |
| Version Control | Git, GitHub |
| CI/CD | GitHub Actions |

## 4. System Architecture

FinCore follows a layered application architecture.

```text
                 CUSTOMER / STAFF
                        |
                        v
              NEXT.JS FRONTEND
             React + TypeScript
                        |
                        v
               EXPRESS BACKEND
             REST API + Business Logic
                        |
              Authentication Layer
                        |
                        v
                POSTGRESQL
          Customer / Wallet / Ledger
          Transfer / Dispute Records
                        |
                        v
             DATABASE FUNCTIONS
               AND TRIGGERS

          PYTHON FASTAPI SERVICE
              Analytics Layer
```

### Architecture Responsibilities

**Frontend**
- Provides customer-facing and operations interfaces.
- Handles navigation, forms, and user interactions.
- Communicates with the backend through API requests.
- Displays wallet and financial information.

**Backend**
- Processes application requests.
- Handles authentication and authorization.
- Validates financial operations.
- Performs customer-scoped database queries.
- Coordinates transfer and ledger operations.

**Database**
- Stores customer and financial records.
- Maintains wallet/account and transaction information.
- Supports relational integrity.
- Uses database functions and triggers for relevant balance updates.

**Analytics**
- Provides a separate Python-based service for analytics-related operations.

## 5. Database Design

FinCore uses PostgreSQL as its relational database.

The database supports the application's customer, wallet, transaction, and financial record management.

Key database entities include:

- Customers
- Sessions
- Accounts
- Ledger Transactions
- Ledger Entries
- Beneficiaries
- Transfers
- Disputes

### Database Concepts Applied

- Relational database design.
- Primary and foreign key relationships.
- Data integrity constraints.
- Database migrations.
- SQL queries and transactions.
- Database functions and triggers.
- Customer-linked financial records.

### Ledger-Based Transaction Processing

FinCore uses ledger entries to record relevant debit and credit operations.

For a simulated transfer:
1. Validate the customer and destination account.
2. Verify the available balance.
3. Process the debit and credit operations.
4. Record the corresponding ledger entries.
5. Update the relevant account balances.
6. Persist the transfer record.

The relevant database operations are performed transactionally to maintain financial record consistency.

## 6. Security & Data Isolation

Security and customer data separation are important aspects of FinCore.

Implemented mechanisms include:

- Password hashing using scrypt.
- Database-backed authentication sessions.
- Session invalidation on logout.
- Protected API operations.
- Server-side customer authorization.
- Customer-scoped database queries.
- Validation of transfer ownership and account access.

Customer isolation was tested using two separate customer accounts. An attempt by one customer to access another customer's wallet through a transfer operation was rejected.

**Note:** FinCore is an educational simulation and is not designed or certified for production banking or real-money payment processing.

## 7. API & Backend

The Express backend exposes REST API operations for the application's existing functionality.

Backend responsibilities include:

- Customer registration.
- Login and logout.
- Authentication and session verification.
- Wallet/account retrieval.
- Beneficiary management.
- Fund transfers.
- Transaction records.
- Dispute management.
- Statement-related operations.
- Operations-related functionality.

### Health Check

Backend health endpoint:

```http
GET /api/health
```

The health response includes the backend service status and database connectivity status.

## 8. Project Structure

```text
FinCore/
|
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |-- components/
|   |   |-- lib/
|   |-- package.json
|
|-- backend/
|   |-- src/
|   |-- package.json
|   |-- .env.example
|
|-- analytics/
|   |-- src/
|
|-- database/
|   |-- migrations/
|   |-- seed/
|
|-- infrastructure/
|   |-- docker/
|
|-- docs/
|
|-- tests/
|
|-- README.md
```

*The structure above summarizes the main project areas. Refer to the actual repository for the complete file structure.*

## 9. Installation & Setup

### Prerequisites

Install the following tools before running the application:

- Node.js and npm.
- Python.
- Docker Desktop with Docker Compose.
- PostgreSQL-compatible Docker environment.
- Git.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Anil123-eng/FinCore.git
cd FinCore
```

### Step 2 — Start the PostgreSQL Database

From the configured Docker Compose directory, start the FinCore database service:

```bash
docker compose -p fincore up -d db
```

The FinCore database is configured to use host port `5433`, separate from the unrelated starter services.

### Step 3 — Configure Backend Environment

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Use the existing `.env.example` as the reference for required environment variables.

Create and configure your local `.env` file with the appropriate database connection settings and application configuration.

**Never commit actual credentials, passwords, or secret keys to GitHub.**

### Step 4 — Start the Backend

```bash
npm start
```

Verify backend health:

```text
http://localhost:3001/api/health
```

### Step 5 — Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the application:

```text
http://localhost:3000
```

### Step 6 — Analytics Service

The analytics component is maintained separately under the `analytics/` directory.

Refer to its existing service configuration and documentation for its Python environment, dependencies, and startup command.

## 10. Testing & Verification

The project has undergone functional and technical verification.

| Test Area | Verification |
|---|---|
| PostgreSQL connection | Successful |
| Database migrations | Successful |
| Backend database read/write | Successful |
| Customer registration | Successful |
| Customer login | Successful |
| Invalid login handling | Verified |
| Logout and session invalidation | Verified |
| Customer data isolation | Verified |
| Wallet/account retrieval | Verified |
| Beneficiary operations | Verified |
| Fund transfers | Successful |
| Insufficient-funds validation | Verified |
| Ledger balance updates | Verified |
| Transaction records | Verified |
| Dispute persistence | Verified |
| Statement-related persistence | Verified |
| Frontend production build | Successful |
| Frontend lint | Successful |
| Backend TypeScript compilation | Successful |
| Page availability | Verified |

### Build and Validation Commands

Frontend production build:

```bash
npm run build
```

Frontend lint:

```bash
npm run lint
```

Backend TypeScript compilation:

```bash
npx tsc
```

These commands should be executed from their respective project directories.

## 11. User Interface

FinCore provides a responsive web interface with a light pastel visual theme.

The interface includes:

- Public landing page.
- Customer registration and login.
- Dashboard.
- Wallet management.
- Beneficiary management.
- Transfers.
- Transactions.
- Statements.
- Disputes.
- Operations interface.

The design uses soft blue, lavender, mint, peach, and other pastel colors with dark readable text.

## 12. Engineering Concepts Demonstrated

This project demonstrates practical application of:

- Full-stack application development.
- Frontend component-based architecture.
- REST API design and integration.
- TypeScript application development.
- Backend business logic.
- PostgreSQL relational database design.
- SQL migrations and database triggers.
- Database transactions and ledger-based accounting concepts.
- Authentication and session management.
- Server-side authorization.
- Customer data isolation.
- Input validation and error handling.
- Docker-based database setup.
- Application testing and debugging.
- Technical documentation.

## 13. Project Scope & Completion

The project was developed according to the agreed assessment scope.

| Scope | Status |
|---|---|
| Handbook Sections 1–8 | Completed |
| Handbook Sections 9–15 | Not implemented in this submission scope |

Sections 9–15 are outside the agreed implementation scope. Their requirements are not represented as completed functionality.

## 14. Limitations

FinCore is a simulated educational application.

- Transfers use simulated funds.
- No real bank accounts are connected.
- No real payment-provider settlement takes place.
- The platform is not intended for real banking operations.
- Production-grade financial compliance and deployment certification are outside this project's scope.

## 15. Future Improvements

Potential future development directions include:

- Integration with a payment-provider sandbox.
- Advanced transaction monitoring.
- Enhanced analytics and reporting.
- Additional automated integration tests.
- Production deployment and monitoring.
- Expanded financial workflow capabilities.

These are potential future improvements and are not claims of currently implemented functionality.

## 16. Important Notice

FinCore is developed for educational, demonstration, and portfolio purposes only.

No real funds, banking credentials, or actual payment transactions are involved.

---

## Repository

**GitHub:** https://github.com/Anil123-eng/FinCore

**Project:** FinCore — Digital Wallet, Ledger & Payment Processing Platform
 
