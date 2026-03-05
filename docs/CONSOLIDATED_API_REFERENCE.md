# API Reference - Portal Transaccional Coasmedas

> **Generated:** 2026-02-05
> **Sources:** Mobile App Audit (`API_AUDIT.md`), Backend CERP Config Analysis (`API_DOCUMENTATION.md`), Postman Collection (`CoasmedasApp.postman_collection.json`)

---

## Overview

| Metric | Count |
|--------|-------|
| Total endpoints available (backend) | 46 |
| Currently used by mobile app | 46 |
| Endpoints with Postman examples | 18 |
| Endpoints without Postman examples | 28 |
| Excluded (not implementing) | 3 (TransfiYa x2, `/register-device`) |

### Protocol

- **Method:** POST (all endpoints, including data retrieval)
- **Content-Type:** `application/json; charset=UTF-8`
- **Base URLs:**
  - Development: `https://intepruapp.coasmedas.coop`
  - Production: `https://inteprodapp.coasmedas.coop`
  - Local: `https://192.168.20.24` (Postman)

### Response Envelope

All responses follow this structure:

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {}
}
```

- `statusCode: 0` = success
- `statusCode: 107` = unauthorized (token expired/invalid)
- Other codes = error (see Error Codes section)

---

## Authentication

### JWT (Protected Endpoints)

- **Header:** `Authorization: Bearer <token>`
- **Algorithm:** RS256 (signed with PFX certificate)
- **Claims:** `{ "iss": "CERP", "sub": "<documentNumber>", "exp": <unix_timestamp> }`
- **Issued:** After successful `/login`

### OTP (Verification)

- **Delivery:** SMS via Inalambria service
- **Format:** 6-digit numeric code (0-999999)
- **Storage:** BCrypt hash in `Cerp_Coasmedas_OTP` table
- **Used for:** Registration, login, password update, transaction confirmation

---

## Common Request Patterns

**User Identification (most endpoints):**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890"
}
```

**Allowed Document Types:** CC, CE, NIT, TI, PA

**Source Account Object:**
```json
{
  "codigoProductoCobis": "01",
  "idCuenta": "1234567890",
  "numeroCuenta": "12345678901234567890",
  "tipoCartera": "0"
}
```
> `tipoCartera` is only required for credit accounts.

**Device Info (BRE-B endpoints):**
```json
{
  "ip": "192.168.1.1",
  "userAgentString": "Mozilla/5.0 ...",
  "trademark": "Apple",
  "model": "iPhone17,3",
  "platform": "ios",
  "versionPlatform": "18.5"
}
```

---

## Endpoints by Domain

---

### 1. Authentication

#### `POST /get-salt`

- **Status:** :white_check_mark: Used in mobile
- **Description:** Retrieve BCrypt salt for password hashing before login/password-change
- **Mobile usage:** Login screen, Change Password screen

> **Auth resolved:** No auth required. Used pre-login (salt needed to hash password before authenticating). Confirmed by mobile app + Postman behavior. Backend config marking as JWT is incorrect.

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "79138052"
}
```
> Backend docs include `"indPag": "1"` but mobile and Postman omit it. Likely optional.

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "salt": "$2a$10$BqHqjGjGB6ywrAHZ.i5A/."
  }
}
```

---

#### `POST /send-otp`

- **Status:** :white_check_mark: Used in mobile
- **Description:** Send OTP to user's registered mobile number via SMS
- **Mobile usage:** Login screen, Registration screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "79138052"
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "mobile": "********73",
    "email": "****r@yahoo.com"
  }
}
```

**Notes:**
- Contact info is masked for privacy
- `email` field present in backend + Postman but missing from mobile report

---

#### `POST /login`

- **Status:** :white_check_mark: Used in mobile
- **Description:** Authenticate user and obtain JWT token
- **Mobile usage:** Login screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "79138052",
  "password": "$2a$10$BqHqjGjGB6ywrAHZ.i5A/.s7VsVmkHbfRogDnlfRo4MFyWDCSF2ey",
  "otp": "745765"
}
```
> Backend docs include an optional `deviceId` field. Not used by mobile or web.

**Response (Postman actual):**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "address": "CR 62 165 A 69 TO 4 AP 516",
    "city": "BOGOTA D.C.",
    "documentType": "CC",
    "documentNumber": 79138052,
    "email": "orlanbarr@yahoo.com",
    "mobile": 3006747173,
    "fullName": "EDGAR ORLANDO BARRERO GONZALEZ",
    "phone": 3006747173,
    "state": "DISTRITO CAPITAL",
    "token": "eyJhbGciOiJSUzI1NiJ9..."
  }
}
```

**Notes:**
- `documentNumber` and `mobile` returned as numbers (not strings)
- Password must be BCrypt hash (60 chars). Salt retrieved via `/get-salt`
- Password verification uses BCrypt + HMAC-SHA256 pepper server-side

---

#### `POST /send-otp/transaction`

- **Status:** :white_check_mark: Used in mobile
- **Description:** Send OTP for transaction confirmation (payments/transfers)
- **Mobile usage:** All payment and transfer verification screens

> **Auth resolved:** No auth required. Mobile report is correct. Backend config marking as JWT is not enforced.

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "trnType": "PaymentInternal"
}
```

**Allowed `trnType` values:**
- `PaymentInternal`
- `TransferInternal`
- `TransferExternalBanks`
- `TransferExternalEntities`

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "mobile": "********90",
    "email": "****@domain.com"
  }
}
```

---

### 2. Registration

#### `POST /userValidation`

- **Status:** :white_check_mark: Used in mobile
- **Description:** Validate that a user exists in the core banking system before registration
- **Mobile usage:** Registration screen

> **Auth resolved:** No auth required. Pre-registration endpoint - user has no account yet. Mobile report is correct.

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890"
}
```
> Backend includes `indPag: "1"`.

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa"
}
```
> No payload. Confirmation only. Error code 101 if user not found.

---

#### `POST /register`

- **Status:** :white_check_mark: Used in mobile
- **Description:** Register a new user in the portal
- **Mobile usage:** Registration/Password screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "password": "<bcrypt_hash_60_chars>",
  "salt": "<bcrypt_salt_29_chars>",
  "otp": "123456"
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "address": "<string>",
    "city": "<string>",
    "documentType": "<string>",
    "documentNumber": 1234567890,
    "email": "<string>",
    "mobile": 3001234567,
    "fullName": "<string>",
    "phone": 3001234567,
    "state": "<string>",
    "token": "string"
  }
}
```

> `token` is a literal `"string"` placeholder -- no JWT is generated during registration. User must log in separately.

---

### 3. Password Management

#### `POST /update-password`

- **Status:** :white_check_mark: Used in mobile
- **Description:** Update user password (requires OTP verification)
- **Mobile usage:** Change Password screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "password": "<new_bcrypt_hash_60_chars>",
  "salt": "<new_bcrypt_salt_29_chars>",
  "otp": "123456"
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "address": "<string>",
    "city": "<string>",
    "documentType": "<string>",
    "documentNumber": 1234567890,
    "email": "<string>",
    "mobile": 3001234567,
    "fullName": "<string>",
    "phone": 3001234567,
    "state": "<string>"
  }
}
```

---

### 4. Account & Products

#### `POST /balances`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Query consolidated account balances across all product types
- **Mobile usage:** Home screen, Balances screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890"
}
```
> Backend includes `indPag: "1"`.

**Response:**

> :warning: **MAJOR DISCREPANCY:** Mobile report shows categorized object `{ ahorro: [...], aportes: [...], ... }`. Backend shows flat array `[{ producto, saldo }]`. **Backend is the authoritative source (MapFrame-based).** The mobile app likely transforms this flat structure client-side.

**Backend response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    { "producto": "AHORROS", "saldo": "150000" },
    { "producto": "APORTES", "saldo": "500000" }
  ]
}
```

**Mobile interpretation:**
```json
{
  "payload": [{
    "ahorro": [...],
    "aportes": [...],
    "inversion": [...],
    "credito": [...],
    "proteccion": [...]
  }]
}
```

**Notes:**
- Need to verify actual response structure with a real API call
- The mobile app may be using a different internal structure or the backend may have been updated

---

#### `POST /movements`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Query account transaction movements
- **Mobile usage:** Product details screens

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "codigoProductoCobis": "01",
  "idCuenta": "1234567890",
  "fechaConsulta": "20240101",
  "tipoCartera": "0",
  "indPag": "1"
}
```

**Notes on request fields:**
- `fechaConsulta`: Format `YYYYMMDD`. Mobile sends as string, Postman sends as number `0` (all history?)
- `tipoCartera`: Required for credit products, omit for others
- `indPag`: Pagination indicator

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "fechaTransaccion": "20240115",
      "horaTransaccion": "143052",
      "referencia": "12345",
      "tipoTransaccion": "DB",
      "valorTransaccion": "50000",
      "saldoPorTrn": "100000",
      "descripcion": "Transferencia interna"
    }
  ]
}
```

> Returns empty array `[]` when no movements found.

---

#### `POST /products/savings`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Query user's savings accounts with full details
- **Mobile usage:** Savings balances screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "numeroCuenta": "054040001314",
      "alias": "1314",
      "nombreProducto": "NOMINA",
      "saldoDisponible": "150000",
      "saldoTotal": "200000",
      "idCuenta": "16264",
      "codigoProductoCobis": "4"
    }
  ]
}
```

**Notes:**
- :warning: **Type discrepancy:** Backend says all values are strings (MapFrame parsing). Mobile report says `saldoDisponible` and `saldoTotal` are numbers. Postman shows `codigoProductoCobis` as number in BRE-B accounts but likely string here.
- Same response structure used by: `/transfer/internal/sources/savings`, `/transfer/external/sources/savings`, `/payment/internal/sources/savings`, `/transfer/internal/targets/savings`
- Backend includes internal flags (`indicadorTransaccionesInternas`, `indicadorTransaccionesExternasYPagos`) not exposed in the API response

---

#### `POST /products/credits`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Query user's credit/loan accounts
- **Mobile usage:** Credit balance screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "numeroCuenta": "0542001017497",
      "codigoProducto": "07",
      "nombreProducto": "CUPO_R",
      "saldo": "5000000",
      "cupoDisponible": "3000000",
      "pagoMinimo": "150000",
      "pagoTotal": "5000000",
      "diasMora": "0",
      "fechaPago": "20240215",
      "fechaCorte": "20240131",
      "periodoFacturado": "202401",
      "tipoCartera": "1",
      "idCuenta": "33685",
      "codigoProductoCobis": "7"
    }
  ]
}
```

**Notes:**
- Same structure reused by: `/transfer/internal/sources/credits`, `/transfer/external/sources/credits`, `/payment/internal/sources/credits`, `/transfer/internal/targets/credits`

---

#### `POST /products/investments`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Query user's investment products (CDAT, PAC)
- **Mobile usage:** Investment balances screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "numeroCuenta": "054050012345",
      "nombreProducto": "CDAT",
      "cuota": "100000",
      "saldoTotal": "10000000",
      "plazo": "180",
      "fechaVencimiento": "20241231",
      "tasaEfectiva": "12.5",
      "idCuenta": "45678",
      "codigoProductoCobis": "21"
    }
  ]
}
```

**Notes:**
- `codigoProductoCobis === "4"` = PAC, `"21"` = CDAT
- Same structure reused by: `/transfer/internal/sources/investments`, `/transfer/internal/targets/investments`

---

#### `POST /products/contributions`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Query user's contributions (aportes) and permanent savings
- **Mobile usage:** Contributions balance screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "aportes": {
      "saldoTotalAportes": "500000",
      "aportesVigentes": "480000",
      "aportesMora": "20000",
      "fechaCubrimientoAportes": "20240101",
      "fondosSolidariosVigentes": "50000",
      "fondosSolidariosMora": "0",
      "fechaCubrimientoFondosSolidarios": "20240101",
      "numeroCuentaAportes": "054010012345",
      "idCuentaAportes": "11111",
      "codigoProductoCobisAportes": 2
    },
    "ahorroPermanente": {
      "saldoTotalAhorroPermanente": "300000",
      "saldoDisponibleAhorroPermanente": "250000",
      "numeroCuentaAhorroPermanente": "054020054321",
      "idCuentaAhorroPermanente": "22222",
      "codigoProductoCobisAhorroPermanente": 4
    }
  }
}
```

**Notes:**
- If `idCuentaAhorroPermanente == 0`, the `ahorroPermanente` key is omitted
- Monetary fields use `ValorConDecimales` type internally (last 2 digits = decimals, e.g. `150000` = `1500.00`). API converts before returning.
- `codigoProductoCobisAportes` returned as number (not string like other endpoints)

---

#### `POST /products/protection`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Query user's protection/insurance products
- **Mobile usage:** Protection balance screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "numeroCuenta": "054060012345",
      "nombreProducto": "SEGURO VIDA",
      "pagoMinimo": "25000",
      "pagoTotal": "25000",
      "diasMora": "0",
      "fechaPago": "20240228",
      "idCuenta": "55555",
      "codigoProductoCobis": "8"
    }
  ]
}
```

**Notes:**
- Backend includes `diasMora` in the response (not in mobile report)
- Protection products are payment-only (no balance concept)

---

### 5. Payments

#### `POST /payment/products`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List products available for payment
- **Mobile usage:** Payments screen (product selection)

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "tipoProducto": "AH",
      "descProducto": "CUENTA AHORROS",
      "numeroCuenta": "054040001314",
      "pagoMinimo": "50000",
      "idCuenta": "16264",
      "alias": "1314"
    }
  ]
}
```

---

#### `POST /payment/internal/sources/savings`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List savings accounts available as payment source
- **Mobile usage:** Payment source selection screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Response:** Same structure as `/products/savings`.

> Internally reuses `TransferInternalSourcesSavingsFlow`.

---

#### `POST /payment/internal/sources/credits`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List credit accounts available as payment source
- **Mobile usage:** Payment source selection screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Response:** Same structure as `/products/credits`.

> Internally reuses `TransferInternalSourcesCreditsFlow`.

---

#### `POST /payment/internal/createTransaction`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT + OTP
- **Description:** Execute an internal payment transaction
- **Mobile usage:** Payment confirmation/verification screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "otp": "123456",
  "vlrPagoTotal": 150000,
  "origen": {
    "codigoProductoCobis": "01",
    "tipoCartera": "0",
    "idCuenta": "1234567890",
    "numeroCuenta": "12345678901234567890"
  },
  "cuentas": [
    {
      "idCuenta": "16264",
      "numeroCuenta": "054040001314",
      "tipoProducto": "AP",
      "vlrPago": 150000
    }
  ]
}
```

> **Note:** The `cuentas` array supports multi-product unified payment. Each entry uses `tipoProducto` (e.g. "AP", "CR", "PR") obtained from `/payment/products` by matching `idCuenta`.

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "numAprobacion": 12345,
    "fechaTrn": "20240115",
    "horaTrn": 143052,
    "vlrPagoTotal": 150000
  }
}
```

---

#### `POST /payment/payzen/createTransaction`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Create a Payzen payment link (PSE-like external payment)
- **Mobile usage:** Payzen payment confirmation screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "vlrPagoTotal": 150000,
  "pagador": {
    "documentType": "CC",
    "documentNumber": "1234567890",
    "names": "John",
    "lastNames": "Doe",
    "email": "john@example.com",
    "mobile": "3001234567"
  },
  "merchantComment": "Pago de cuota"
}
```

> Mobile app also sends `cuentas` array. Backend docs do not include it.

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "paymentUrl": "https://payzen-gateway.example.com/payment/..."
  }
}
```

**Notes:**
- User should be redirected to `paymentUrl` to complete payment
- Third-party integration with Payzen payment gateway

---

### 6. Internal Transfers

#### `POST /transfer/internal/sources/savings`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List savings accounts available as transfer source
- **Mobile usage:** Internal transfer source selection

**Request/Response:** Same as `/products/savings`.

---

#### `POST /transfer/internal/sources/credits`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List credit accounts available as transfer source
- **Mobile usage:** Internal transfer source selection

**Request/Response:** Same as `/products/credits`.

---

#### `POST /transfer/internal/sources/investments`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List investment accounts available as transfer source
- **Mobile usage:** Internal transfer source selection

**Request/Response:** Same as `/products/investments`.

---

#### `POST /transfer/internal/targets/savings`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List savings accounts available as transfer destination
- **Mobile usage:** Internal transfer destination selection

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "idCuenta": "16264",
      "numeroCuenta": "054040001314",
      "alias": "1314",
      "nombreProducto": "NOMINA",
      "codigoProductoCobis": "4",
      "saldoDisponible": 150000
    }
  ]
}
```

---

#### `POST /transfer/internal/targets/credits`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List credit accounts available as transfer destination

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "idCuenta": "33685",
      "tipoCartera": "1",
      "numeroCuenta": "0542001017497",
      "codigoProducto": "07",
      "nombreProducto": "CUPO_R",
      "codigoProductoCobis": "7",
      "cupoDisponible": 3000000
    }
  ]
}
```

---

#### `POST /transfer/internal/targets/investments`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List investment accounts available as transfer destination

**Response:** Same structure as `/transfer/internal/targets/savings`.

---

#### `POST /transfer/internal/createTransaction`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT + OTP
- **Description:** Execute an internal transfer between own accounts
- **Mobile usage:** Transfer verification screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "otp": "123456",
  "origen": {
    "codigoProductoCobis": "01",
    "tipoCartera": "0",
    "idCuenta": "1234567890",
    "numeroCuenta": "12345678901234567890"
  },
  "destino": {
    "codigoProductoCobis": "01",
    "tipoCartera": "0",
    "idCuenta": "0987654321",
    "numeroCuenta": "09876543210987654321"
  },
  "valorTransferencia": 50000
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "numAprobacion": 12345,
    "fechaTrn": "20240115",
    "horaTrn": 143052,
    "valorTransferencia": 50000
  }
}
```

---

### 7. External Transfers (Banks - Visionamos)

#### `POST /transfer/external/sources/savings`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List savings accounts for external transfer source

**Request/Response:** Same as `/products/savings`. Reuses `TransferInternalSourcesSavingsFlow`.

---

#### `POST /transfer/external/sources/credits`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List credit accounts for external transfer source

**Request/Response:** Same as `/products/credits`. Reuses `TransferInternalSourcesCreditsFlow`.

---

#### `POST /transfer/external/listBanks`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List available banks for external transfers (Visionamos)
- **Mobile usage:** External transfer destination selection

**Request:** `{}` (no required fields)

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    { "code": "001", "name": "BANCO DE BOGOTA" },
    { "code": "002", "name": "BANCO POPULAR" }
  ]
}
```

> Third-party: Proxies to Visionamos API.

---

#### `POST /transfer/external/getTransactionCost`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Get the commission/cost for an external transfer
- **Mobile usage:** External transfer cost confirmation screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "origen": {
    "codigoProductoCobis": "01",
    "tipoCartera": "0",
    "idCuenta": "1234567890"
  },
  "destino": {
    "name": "Recipient Name",
    "documentType": "CC",
    "documentNumber": "9876543210",
    "accountNumber": "09876543210987654321",
    "accountType": "01",
    "entityCode": "001"
  },
  "valorTransferencia": 50000
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "numAprobacion": "123456",
    "comision": 5800
  }
}
```

---

#### `POST /transfer/external/banks/createTransaction`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT + OTP
- **Description:** Execute an external bank transfer (Visionamos)
- **Mobile usage:** External transfer verification screen

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "otp": "123456",
  "origen": {
    "codigoProductoCobis": "01",
    "tipoCartera": "0",
    "idCuenta": "1234567890",
    "numeroCuenta": "12345678901234567890"
  },
  "destino": {
    "name": "Recipient Name",
    "documentType": "CC",
    "documentNumber": "9876543210",
    "accountNumber": "09876543210987654321",
    "accountType": "01",
    "entityCode": "001"
  },
  "valorTransferencia": 50000
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "numAprobacion": "ABC123",
    "fechaTrn": "20240115",
    "horaTrn": "143052",
    "valorTransferencia": 50000
  }
}
```

> `numAprobacion` is a string (from Visionamos `approvalNumber`).

---

### 8. External Transfers (Coopcentral Entities)

#### `POST /transfer/external/listEntities`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List cooperative entities available via Visionamos
- **Mobile usage:** Coop transfer destination selection

**Request:** `{}` (no required fields)

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    { "code": "001", "name": "COOPCENTRAL" }
  ]
}
```

---

#### `POST /transfer/external/entities/targets/queryProduct`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Validate a destination account at an external entity
- **Mobile usage:** Coop transfer destination validation

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "destino": {
    "documentType": "CC",
    "documentNumber": "9876543210",
    "accountNumber": "12345678901234567890",
    "accountType": "01",
    "entityCode": "001"
  }
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa"
}
```
> No payload. Confirmation only.

---

#### `POST /transfer/external/entities/createTransaction`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT + OTP
- **Description:** Execute an external entity transfer
- **Mobile usage:** Coop transfer verification screen

**Request:** Same structure as `/transfer/external/banks/createTransaction`.

**Response:** Same structure as `/transfer/external/banks/createTransaction`.

---

### 9. BRE-B (Key-Based Instant Transfers)

> All BRE-B endpoints proxy to Visionamos BRE-B API. They authenticate with Visionamos using a separate OAuth token before each API call.

#### `POST /bre-b/accounts/list`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List accounts eligible for BRE-B key registration

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "93363449",
  "indPag": "0"
}
```

**Response (Postman actual):**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "numeroCuenta": "054040001314",
      "aliasCuenta": "1314",
      "nombreProducto": "NOMINA",
      "tipoCuenta": "AH",
      "subtipoCuenta": "AV",
      "codigoProductoCobis": 4,
      "idCuentaAhorroPermanente": "16264"
    },
    {
      "numeroCuenta": "0542001017497",
      "aliasCuenta": "CUPO_R",
      "nombreProducto": "CUPO_R",
      "tipoCuenta": "CR",
      "subtipoCuenta": "CR",
      "codigoProductoCobis": 7,
      "idCuentaAhorroPermanente": "33685"
    }
  ]
}
```

**Notes:**
- `codigoProductoCobis` is a number in the actual response (not string)
- `tipoCuenta`: `AH` = savings, `CR` = credit
- `subtipoCuenta`: `AV` = vista, `CR` = credit rotation

---

#### `POST /bre-b/keys/list`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List user's registered BRE-B keys

**Request:**
```json
{
  "user": "ANDERSON SOLANO BERNAL",
  "documentType": "CC",
  "documentNumber": "93363449",
  "ip": "192.12.34.35",
  "userAgentString": "Mozilla/5.0 ...",
  "trademark": "Apple",
  "model": "iPhone17,3",
  "platform": "ios",
  "versionPlatform": "18.5"
}
```

**Response (Postman actual - with keys):**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "keysCustomers": [
      {
        "idKeyCustomer": "24d25130-be71-45c6-bdbb-d445dbba47e6",
        "stateKeyCustomer": "ACTV",
        "typeKeyCustomer": "M",
        "valueKeyCustomer": "3134836579",
        "sourceNumberAccount": "054020017365",
        "sourceTypeAccount": "AH",
        "sourceSubTypeAccount": "AH"
      }
    ]
  }
}
```

**Response (no keys):**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "keysCustomers": []
  }
}
```

---

#### `POST /bre-b/keys/resolve`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Resolve a BRE-B key to find the recipient

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "93363449",
  "valueKeyCustomer": "3134800014",
  "user": "ANDERSON SOLANO BERNAL",
  "ip": "192.12.34.35",
  "userAgentString": "Mozilla/5.0 ...",
  "trademark": "Apple",
  "model": "iPhone17,3",
  "platform": "ios",
  "versionPlatform": "18.5"
}
```

**Response (Postman actual):**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "firstName": "JOHN",
    "surname": "DOE",
    "identification": "12345678",
    "typeIdentification": "CC",
    "keysCustomers": [...]
  }
}
```

---

#### `POST /bre-b/keys/create`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Create a new BRE-B key

**Key Types (`typeKeyCustomer`):**
- `E` - Email
- `M` - Mobile number
- `B` - Business code
- `O` - Alphanumeric
- `NRIC` - Document ID

**Request:**
```json
{
  "typeKeyCustomer": "M",
  "valueKeyCustomer": "3134800014",
  "sourceNumberAccount": "054020017365",
  "sourceTypeAccount": "AH",
  "sourceSubTypeAccount": "AV",
  "sourceTypeAccountDescription": "DIARIO",
  "user": "ANDERSON SOLANO BERNAL",
  "firstName": "ANDERSON SOLANO BERNAL",
  "surName": "ANDERSON SOLANO BERNAL",
  "documentType": "CC",
  "documentNumber": "93363449",
  "ip": "192.12.34.35",
  "userAgentString": "Mozilla/5.0 ...",
  "trademark": "Apple",
  "model": "iPhone17,3",
  "platform": "ios",
  "versionPlatform": "18.5"
}
```

**Response (Postman actual - success):**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "idKeyCustomer": "24d25130-be71-45c6-bdbb-d445dbba47e6",
    "stateKeyCustomer": "ACTV",
    "creationDateTime": "2025-09-25T11:29:20.313",
    "statusUpdateDateTime": "2025-09-25T11:29:20.313",
    "sourceTypeAccount": "AH",
    "sourceSubTypeAccount": "AH",
    "sourceNumberAccount": "054020017365",
    "firstName": "ANDERSON SOLANO BERNAL",
    "surName": "ANDERSON SOLANO BERNAL",
    "sourceIdentification": "79883274",
    "sourceTypeIdentification": "CC",
    "sourceTypePerson": "N",
    "valueKeyCustomer": "3134836579",
    "typeKeyCustomer": "M",
    "sourceEntityIdentification": "860014040",
    "sourceEntityName": "Coasmedas",
    "stateCode": "U000",
    "stateDescriptionSystem": "Success"
  }
}
```

**Response (already used key):**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": { "stateCode": "U119" }
}
```

---

#### `POST /bre-b/keys/update`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Update an existing BRE-B key
- **Request:** Same as `/bre-b/keys/create` with added `idKeyCustomer`

---

#### `POST /bre-b/keys/delete`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Delete a BRE-B key
- **Request:** Same as keys/update

---

#### `POST /bre-b/keys/block`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Block a BRE-B key
- **Request:** Same as keys/update

---

#### `POST /bre-b/keys/unblock`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Unblock a BRE-B key
- **Request:** Same as keys/update

---

#### `POST /bre-b/terms/accept`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Accept BRE-B terms and conditions

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "93363449",
  "user": "ANDERSON SOLANO BERNAL",
  "ip": "192.12.34.35"
}
```

**Response (Postman actual):**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "code": 200,
    "message": "Registrado correctamente.",
    "response": { "approved": true }
  }
}
```

---

#### `POST /bre-b/txs/init`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Initiate a BRE-B transfer transaction

**Request:**
```json
{
  "documentNumber": "93363449",
  "documentType": "CC",
  "user": "ANDERSON SOLANO BERNAL",
  "sourceFirstName": "ANDERSON",
  "sourceSurName": "SOLANO BERNAL",
  "sourceNumberAccount": "054020017365",
  "sourceTypeAccount": "AH",
  "sourceSubTypeAccount": "AV",
  "sourceTypeAccountDescription": "DIARIO",
  "targetNode": "<string>",
  "targetResolutionId": "<string>",
  "targetValueKeyCustomer": "3134800014",
  "targetTypeKeyCustomer": "M",
  "targetEntity": "<string>",
  "targetNumberAccount": "<string>",
  "targetTypeAccount": "AH",
  "targetSubTypeAccount": "AV",
  "targetTypeAccountDescription": "<string>",
  "targetIdentification": "12345678",
  "targetTypeIdentification": "CC",
  "targetFirstName": "JOHN",
  "targetSurName": "DOE",
  "amount": 50000,
  "ip": "192.12.34.35",
  "userAgentString": "Mozilla/5.0 ...",
  "trademark": "Apple",
  "model": "iPhone17,3",
  "platform": "ios",
  "versionPlatform": "18.5"
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "paymentId": "abc123",
    "sequence": "001"
  }
}
```

---

#### `POST /bre-b/txs/status`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** Check BRE-B transaction status

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "93363449",
  "user": "ANDERSON SOLANO BERNAL",
  "paymentId": "abc123",
  "ip": "192.12.34.35",
  "userAgentString": "Mozilla/5.0 ...",
  "trademark": "Apple",
  "model": "iPhone17,3",
  "platform": "ios",
  "versionPlatform": "18.5"
}
```

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "stateCodePayment": "STTL",
    "statePaymentDescription": "Settled",
    "stateDescriptionCustomer": "Transferencia exitosa"
  }
}
```

**State Codes:** `SCHD` (Scheduled), `PROC` (Processing), `ACPT` (Accepted), `STTL` (Settled/Complete), `RTRN` (Returned), `CNCL` (Cancelled), `TIMEOUT`

---

#### `POST /bre-b/txs/list`

- **Status:** :white_check_mark: Used in mobile | Auth: JWT
- **Description:** List BRE-B transaction history

**Request:**
```json
{
  "documentType": "CC",
  "documentNumber": "93363449",
  "initialDate": 20240101,
  "initialHour": "000000",
  "finalDate": 20240131,
  "finalHour": "235959"
}
```

> :warning: **Type discrepancy:** Mobile sends dates as strings `"YYYYMMDD"`. Backend sends as numbers `20240101`. Use numbers per backend spec.

**Response:**
```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "movements": [...]
  }
}
```

---

## Error Codes

| Code | Description | Action |
|------|-------------|--------|
| 0 | Success | Process response |
| 1 | Login error | Show error message |
| 2 | Request validation failed | Check request format |
| 4 | User already registered | Show info message |
| 101 | User not found | Show not found message |
| 102 | Mobile format error in core | Contact support |
| 103 | Email format error in core | Contact support |
| 105 | Core banking communication error | Retry or show error |
| 106 | Invalid OTP | Ask user to retry |
| 107 | Unauthorized | Redirect to login |
| 108 | Visionamos web service error | Show error |
| 109 | Payzen WS error | Show payment error |
| 110 | Payzen rejection | Show Payzen error detail |
| 111 | Payzen no response | Show timeout error |
| 112 | Visionamos transaction WS error | Show error |
| 113 | Visionamos transaction rejected | Show rejection message |
| 114 | Visionamos no response | Show timeout error |
| 116 | Inalambria (SMS) error | Show SMS error |
| 500 | BRE-B Visionamos error | Show error with upstream details |

### Special State Codes

| Code | Meaning |
|------|---------|
| `U119` | Empty result / Already exists (context-dependent) |

### Error Message Extraction Priority

1. `responseData.payload.error.stateDescriptionCustomer`
2. `responseData.statusDesc`

---

## Validation Rules

| Field | Rule |
|-------|------|
| `documentNumber` | Numeric, up to 16 digits |
| `otp` | Numeric, 6 digits (0-999999) |
| `password` | String, max 60 chars (BCrypt hash) |
| `salt` | String, max 29 chars (BCrypt salt) |
| `documentType` | Allowed: CC, CE, NIT, TI, PA |

---

## Flow Reuse Map

Several URL paths share the same backend flow:

| Backend Flow | Endpoints Using It |
|---|---|
| `TransferInternalSourcesSavingsFlow` | `/transfer/internal/sources/savings`, `/transfer/external/sources/savings`, `/payment/internal/sources/savings` |
| `TransferInternalSourcesCreditsFlow` | `/transfer/internal/sources/credits`, `/transfer/external/sources/credits`, `/payment/internal/sources/credits` |
| `TransferInternalSourcesInvestmentsFlow` | `/transfer/internal/sources/investments` |

This means these endpoints return identical response structures.
