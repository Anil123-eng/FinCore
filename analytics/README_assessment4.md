# Assessment 4: Financial Identity and Authorization

## Handbook Requirements
- Assessment 4 from FinCore Handbook Section 6
- Implement authentication, refresh/revocation, role-based permissions, resource-level authorization and audit trails

## Technology Stack
- Node.js/Express.js for backend authentication
- bcrypt for password hashing
- JWT/session authentication
- Role-based access control
- Resource-level authorization

## Implementation Details
- User registration and login functionality
- JWT token generation and validation
- Role-based access control middleware
- Resource-level authorization checks
- Audit log entries for all transactions
- MFA simulation with one-time codes
- Secure transaction confirmation flow

## Important Files
- backend/src/auth.py
- backend/src/middleware.py
- backend/src/routes/auth.py
- Configuration files for JWT and bcrypt

## Running the Implementation
```bash
cd backend
npm install bcrypt bcryptjs jsonwebtoken
npm run dev
```

---\n\n",