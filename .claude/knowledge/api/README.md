# Coasmedas API Reference

**Full Spec**: [coasmedas-api-spec.yaml](./coasmedas-api-spec.yaml)

---

## Overview

This portal consumes the **Coasmedas Banking API**, a REST API that provides:
- User authentication with OTP
- Account balance queries
- Transaction history
- Internal/external transfers
- Payment processing via PayZen

**Authentication**: JWT Bearer tokens (obtained from `/login`)

**Base URLs**:
- Local: `http://localhost:9030`
- Staging: `https://staging-api.coasmedas.com`
- Production: `https://api.coasmedas.com`

---

## Key Concepts

### Document Types
```
CC = Cédula de Ciudadanía
CE = Cédula de Extranjería
TI = Tarjeta de Identidad
PA = Pasaporte
```

### OTP Flow
All authentication operations require OTP:
1. User enters document credentials
2. Call `/send-otp` to send OTP via SMS
3. User receives 6-digit OTP code
4. Use OTP in `/login` or `/register`

**OTP Lifetime**: ~5 minutes (configured server-side)

### Password Hashing
Passwords must be **pre-hashed on client** with BCrypt:
- Client generates random salt
- Client hashes password with BCrypt
- Send hashed password + salt to backend

### JWT Authentication
After successful login:
- Backend returns JWT token
- Store token securely (HTTP-only cookie recommended)
- Include in all authenticated requests: `Authorization: Bearer {token}`

---

## Authentication Endpoints

### POST `/send-otp`
**Purpose**: Send OTP code via SMS
**Auth**: None required
**Request**:
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```
**Response**:
```json
{
  "status": "success",
  "message": "Código OTP enviado exitosamente"
}
```

### POST `/register`
**Purpose**: Register new user
**Auth**: None required
**Requirements**: Valid OTP from `/send-otp`
**Request**:
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "password": "$2a$10$...",  // BCrypt hashed
  "salt": "randomSalt123456",
  "otp": "123456",
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "mobile": "3001234567"  // Colombian format
}
```
**Response**:
```json
{
  "status": "success",
  "message": "Usuario registrado exitosamente",
  "userId": "12345",
  "documentNumber": "1234567890"
}
```

### POST `/login`
**Purpose**: Authenticate user
**Auth**: None required
**Requirements**: Valid OTP from `/send-otp`
**Request**:
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "password": "$2a$10$...",  // BCrypt hashed
  "otp": "123456",
  "deviceId": "device-uuid-123"
}
```
**Response**:
```json
{
  "status": "success",
  "jwtToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userData": {
    "userId": "12345",
    "documentNumber": "1234567890",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com"
  }
}
```

---

## Account Endpoints

### GET `/balances`
**Purpose**: Get all account balances
**Auth**: JWT required
**Query Params**:
- `documentType`: CC|CE|TI|PA
- `documentNumber`: User's document number
- `indPag`: Page indicator (typically "1")

**Response**:
```json
{
  "status": "success",
  "accounts": [
    {
      "accountNumber": "1234567890",
      "accountType": "AHORROS",
      "productCode": "001",
      "availableBalance": "1500000.00",
      "currentBalance": "1520000.00",
      "blockedBalance": "20000.00"
    }
  ]
}
```

**Account Types**:
- `AHORROS`: Savings account
- `CORRIENTE`: Checking account
- `CREDITO`: Credit account
- `INVERSION`: Investment account

### GET `/movements`
**Purpose**: Get transaction history for specific account
**Auth**: JWT required
**Query Params**:
- `documentType`: Document type
- `documentNumber`: Document number
- `codigoProductoCobis`: Product code from COBIS
- `idCuenta`: Account ID
- `fechaConsulta`: Date in yyyyMMdd format
- `tipoCartera`: Portfolio type
- `indPag`: Page indicator

---

## Transfer Endpoints

### POST `/transfer/internal/createTransaction`
**Purpose**: Transfer between internal accounts
**Auth**: JWT required
**Requirements**: Valid OTP
**Request**:
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "otp": "123456",
  "origen": {
    "codigoProductoCobis": "001",
    "idCuenta": "1234567890",
    "tipoCuenta": "AHORROS"
  },
  "destino": {
    "codigoProductoCobis": "002",
    "idCuenta": "9876543210",
    "tipoCuenta": "CORRIENTE"
  },
  "valorTransferencia": "100000.00",
  "descripcion": "Pago de servicios"
}
```

### GET `/transfer/external/listBanks`
**Purpose**: Get list of banks for external transfers
**Auth**: JWT required
**Third-Party**: Visionamos service

---

## Payment Endpoints

### POST `/payment/payzen/createTransaction`
**Purpose**: Create payment order in PayZen gateway
**Auth**: JWT required
**Third-Party**: PayZen payment gateway

**Flow**:
1. Frontend calls this endpoint
2. Backend creates payment order
3. Backend returns PayZen payment URL
4. Frontend redirects user to PayZen URL
5. User completes payment on PayZen page
6. User redirected back to portal

**Request**:
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "amount": "50000.00",
  "concept": "Pago de servicios",
  "productCode": "001"
}
```

**Response**:
```json
{
  "status": "success",
  "paymentUrl": "https://payzen.com/payment/abc123",
  "orderId": "ORDER-12345"
}
```

---

## Error Handling

All errors follow this format:
```json
{
  "status": "error",
  "errorCode": "AUTH_001",
  "message": "Token inválido o expirado",
  "details": "Optional additional details"
}
```

### Common Error Codes

#### Authentication (AUTH_*)
- `AUTH_001`: Invalid or expired JWT token
- `AUTH_002`: Invalid credentials or OTP

#### User (USR_*)
- `USR_001`: User not found
- `USR_002`: User already exists

#### Account (ACC_*)
- `ACC_001`: No accounts found

#### Request (REQ_*)
- `REQ_001`: Invalid request format

#### Server (SRV_*)
- `SRV_001`: Internal server error
- `SRV_002`: Third-party service error (SMS, Visionamos, PayZen)

### HTTP Status Codes
- `200`: Success
- `400`: Bad request (validation errors)
- `401`: Unauthorized (invalid/missing JWT)
- `404`: Resource not found
- `409`: Conflict (e.g., user already exists)
- `500`: Internal server error
- `502`: Bad gateway (third-party service error)

---

## Implementation Notes

### Frontend Requirements

1. **BCrypt Password Hashing**
   - Install: `bcryptjs` package
   - Generate salt client-side
   - Hash password before sending

2. **JWT Token Management**
   - Store in HTTP-only cookie (recommended) or sessionStorage
   - Include in Authorization header: `Bearer {token}`
   - Handle token expiration (401 errors)
   - Implement token refresh or re-login flow

3. **OTP Flow Implementation**
   ```typescript
   // 1. Send OTP
   await fetch('/send-otp', { ... })

   // 2. Show OTP input to user
   const otp = await getUserOtpInput()

   // 3. Login with OTP
   const { jwtToken } = await fetch('/login', {
     body: { ..., otp }
   })

   // 4. Store JWT
   setAuthToken(jwtToken)
   ```

4. **Device ID**
   - Generate unique device ID (UUID)
   - Store persistently (localStorage)
   - Include in all login requests

5. **Colombian Mobile Validation**
   - Format: 10 digits starting with 3
   - Pattern: `^3[0-9]{9}$`
   - Example: 3001234567

6. **Date Formatting**
   - Transaction queries use `yyyyMMdd` format
   - Example: `20251126` for Nov 26, 2025

---

## Environment Variables

```env
# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:9030

# Or for different environments
NEXT_PUBLIC_API_BASE_URL=https://staging-api.coasmedas.com
NEXT_PUBLIC_API_BASE_URL=https://api.coasmedas.com
```

---

## TypeScript Types

Create types based on API schemas:

```typescript
// Document types
type DocumentType = 'CC' | 'CE' | 'TI' | 'PA';

// Account types
type AccountType = 'AHORROS' | 'CORRIENTE' | 'CREDITO' | 'INVERSION';

// Transaction types
type TransactionType = 'DEBITO' | 'CREDITO';

// Login request/response
interface LoginRequest {
  documentType: DocumentType;
  documentNumber: string;
  password: string; // BCrypt hashed
  otp: string; // 6 digits
  deviceId: string;
}

interface LoginResponse {
  status: 'success';
  jwtToken: string;
  userData: {
    userId: string;
    documentNumber: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Account balance
interface AccountBalance {
  accountNumber: string;
  accountType: AccountType;
  productCode: string;
  availableBalance: string;
  currentBalance: string;
  blockedBalance: string;
}

// Error response
interface ErrorResponse {
  status: 'error';
  errorCode: string;
  message: string;
  details?: string;
}
```

---

## Testing

### Development
- Use local server: `http://localhost:9030`
- Backend must be running locally
- Test OTP flow (check backend logs for OTP codes in dev mode)

### Staging
- Use staging server: `https://staging-api.coasmedas.com`
- Real SMS sent via Inalambria (use real phone numbers)

---

## Related Files

When implementing features using this API:

- **Types**: Create in `src/types/api.ts`
- **API Client**: Create in `src/lib/api-client.ts`
- **Auth Hooks**: Create in `src/hooks/use-auth.ts`
- **Environment**: Configure in `.env.local`

---

**Last Updated**: 2025-11-26
**API Version**: 1.0.0
**Full Spec**: [coasmedas-api-spec.yaml](./coasmedas-api-spec.yaml)
