# API Communication Audit Report - CoasmedasApp

## Executive Summary

This audit covers all backend API communication in the CoasmedasApp React Native application. The app uses a single custom `useResource` hook for all HTTP requests with consistent patterns across **48 distinct endpoints**.

---

## API Infrastructure

### HTTP Client Setup

**File:** `src/hooks/useResource.js`

| Property        | Value                            |
| --------------- | -------------------------------- |
| HTTP Method     | POST (all requests)              |
| Timeout         | 30 seconds (30000ms)             |
| Content-Type    | `application/json;charset=utf-8` |
| AbortController | Yes, per-request                 |
| Cleanup         | On component unmount             |

### Base URL Configuration

**Source:** Environment variables via `react-native-dotenv`

| Environment | BASE_URL                             | Inactivity Timeout |
| ----------- | ------------------------------------ | ------------------ |
| Development | `https://intepruapp.coasmedas.coop`  | 3600s (1 hour)     |
| Production  | `https://inteprodapp.coasmedas.coop` | 60s (1 minute)     |

**Files:** `.env.development`, `.env.production`

### Authentication Mechanism

- **Type:** Bearer Token
- **Header:** `Authorization: Bearer ${token}`
- **Storage:** React Context state (in-memory only, not persisted)
- **Token Flow:** Login → Store in context → Logout clears

---

## Endpoint Summary Table

| #   | Endpoint                                           | Domain       | Auth Required |
| --- | -------------------------------------------------- | ------------ | ------------- |
| 1   | `/get-salt`                                        | Auth         | No            |
| 2   | `/send-otp`                                        | Auth         | No            |
| 3   | `/login`                                           | Auth         | No            |
| 4   | `/userValidation`                                  | Registration | No            |
| 5   | `/register`                                        | Registration | No            |
| 6   | `/update-password`                                 | Password     | No            |
| 7   | `/balances`                                        | Account      | Yes           |
| 8   | `/movements`                                       | Account      | Yes           |
| 9   | `/payment/products`                                | Payments     | Yes           |
| 10  | `/payment/internal/sources/savings`                | Payments     | Yes           |
| 11  | `/payment/internal/sources/credits`                | Payments     | Yes           |
| 12  | `/payment/internal/createTransaction`              | Payments     | Yes           |
| 13  | `/payment/payzen/createTransaction`                | Payments     | Yes           |
| 14  | `/send-otp/transaction`                            | Transactions | No            |
| 15  | `/transfer/internal/sources/savings`               | Transfers    | Yes           |
| 16  | `/transfer/internal/sources/credits`               | Transfers    | Yes           |
| 17  | `/transfer/internal/sources/investments`           | Transfers    | Yes           |
| 18  | `/transfer/internal/targets/savings`               | Transfers    | Yes           |
| 19  | `/transfer/internal/targets/credits`               | Transfers    | Yes           |
| 20  | `/transfer/internal/targets/investments`           | Transfers    | Yes           |
| 21  | `/transfer/internal/createTransaction`             | Transfers    | Yes           |
| 22  | `/transfer/external/sources/savings`               | Transfers    | Yes           |
| 23  | `/transfer/external/sources/credits`               | Transfers    | Yes           |
| 24  | `/transfer/external/listBanks`                     | Transfers    | Yes           |
| 25  | `/transfer/external/getTransactionCost`            | Transfers    | Yes           |
| 26  | `/transfer/external/banks/createTransaction`       | Transfers    | Yes           |
| 27  | `/transfer/external/listEntities`                  | Transfers    | Yes           |
| 28  | `/transfer/external/entities/targets/queryProduct` | Transfers    | Yes           |
| 29  | `/transfer/external/entities/createTransaction`    | Transfers    | Yes           |
| 30  | `/transfer/external/transfiya/getTransactionCost`  | Transfers    | Yes           |
| 31  | `/transfer/external/transfiya/createTransaction`   | Transfers    | Yes           |
| 32  | `/bre-b/keys/list`                                 | BRE-B        | Yes           |
| 33  | `/bre-b/keys/resolve`                              | BRE-B        | Yes           |
| 34  | `/bre-b/keys/create`                               | BRE-B        | Yes           |
| 35  | `/bre-b/keys/update`                               | BRE-B        | Yes           |
| 36  | `/bre-b/keys/delete`                               | BRE-B        | Yes           |
| 37  | `/bre-b/keys/block`                                | BRE-B        | Yes           |
| 38  | `/bre-b/keys/unblock`                              | BRE-B        | Yes           |
| 39  | `/bre-b/accounts/list`                             | BRE-B        | Yes           |
| 40  | `/bre-b/txs/init`                                  | BRE-B        | Yes           |
| 41  | `/bre-b/txs/status`                                | BRE-B        | Yes           |
| 42  | `/bre-b/txs/list`                                  | BRE-B        | Yes           |
| 43  | `/bre-b/terms/accept`                              | BRE-B        | Yes           |
| 44  | `/products/savings`                                | Products     | Yes           |
| 45  | `/products/credits`                                | Products     | Yes           |
| 46  | `/products/investments`                            | Products     | Yes           |
| 47  | `/products/contributions`                          | Products     | Yes           |
| 48  | `/products/protection`                             | Products     | Yes           |

---

## Detailed Endpoint Documentation

### 1. Authentication Domain

#### `/get-salt`

- **File:** `src/screens/Login.js`, `src/screens/ChangePassword.js`
- **Auth:** None
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:**
  ```json
  { "payload": { "salt": "string" } }
  ```
- **Usage:** Get bcrypt salt for password hashing before login/registration

#### `/send-otp`

- **Files:** `src/screens/Login.js`, `src/screens/RegisterPassword.js`
- **Auth:** None
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:**
  ```json
  { "payload": { "mobile": "string" } }
  ```
- **Usage:** Send OTP to user's registered mobile number

#### `/login`

- **File:** `src/screens/Login.js`
- **Auth:** None
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "password": "string (bcrypt hash)",
    "otp": "string"
  }
  ```
- **Response:**
  ```json
  {
    "payload": {
      "token": "string",
      "fullName": "string",
      "email": "string",
      "mobile": "string",
      ...userData
    }
  }
  ```
- **Error Handling:** Sets token in AccountContext on success

---

### 2. Registration Domain

#### `/userValidation`

- **File:** `src/screens/Register.js`
- **Auth:** None
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Usage:** Validate user exists in system before registration

#### `/register`

- **File:** `src/screens/RegisterPassword.js`
- **Auth:** None
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "password": "string (bcrypt hash)",
    "salt": "string",
    "otp": "string"
  }
  ```

---

### 3. Password Management Domain

#### `/update-password`

- **File:** `src/screens/ChangePassword.js`
- **Auth:** None (uses OTP verification)
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "password": "string (bcrypt hash)",
    "salt": "string",
    "otp": "string"
  }
  ```

---

### 4. Account Domain

#### `/balances`

- **Files:** `src/screens/Home.js`, `src/screens/Balances.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:**
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

#### `/movements`

- **File:** `src/screens/ProductDetails.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "codigoProductoCobis": "string",
    "documentNumber": "string",
    "documentType": "string",
    "fechaConsulta": "string (YYYYMMDD)",
    "idCuenta": "string",
    "indPag": "number (pagination)",
    "tipoCartera": "string (for credits)"
  }
  ```
- **Response:** Array of transaction movements

---

### 5. Payments Domain

#### `/payment/products`

- **File:** `src/screens/Payments.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:**
  ```json
  {
    "payload": [
      {
        "numeroCuenta": "string",
        "alias": "string",
        "descProducto": "string",
        "idCuenta": "string",
        "pagoMinimo": "number",
        "tipoProducto": "string"
      }
    ]
  }
  ```

#### `/payment/internal/sources/savings`

- **File:** `src/screens/PaymentsSource.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:** List of savings accounts available for payment

#### `/payment/internal/sources/credits`

- **File:** `src/screens/PaymentsSource.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:** List of credit accounts available for payment

#### `/payment/internal/createTransaction`

- **File:** `src/screens/PaymentsSource.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "vlrPagoTotal": "number",
    "otp": "string",
    "origen": {
      "codigoProductoCobis": "string",
      "idCuenta": "string",
      "numeroCuenta": "string",
      "tipoCartera": "string (optional)"
    },
    "cuentas": [...]
  }
  ```
- **Response:**
  ```json
  {
    "payload": {
      "fechaTrn": "string",
      "horaTrn": "string",
      "numAprobacion": "string",
      "vlrPagoTotal": "number"
    }
  }
  ```

#### `/payment/payzen/createTransaction`

- **File:** `src/screens/PaymentsPayzenConfirmation.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "vlrPagoTotal": "number",
    "pagador": { ...payer details },
    "cuentas": [...],
    "merchantComment": "string"
  }
  ```
- **Response:**
  ```json
  { "payload": { "paymentUrl": "string" } }
  ```

---

### 6. Internal Transfers Domain

#### `/transfer/internal/sources/savings`

- **File:** `src/screens/InternalTransfersSource.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```

#### `/transfer/internal/sources/credits`

- **File:** `src/screens/InternalTransfersSource.js`
- **Auth:** Bearer Token

#### `/transfer/internal/sources/investments`

- **File:** `src/screens/InternalTransfersSource.js`
- **Auth:** Bearer Token

#### `/transfer/internal/targets/savings`

- **File:** `src/screens/InternalTransfersDestination.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:**
  ```json
  {
    "payload": [
      {
        "idCuenta": "string",
        "numeroCuenta": "string",
        "alias": "string",
        "nombreProducto": "string",
        "codigoProductoCobis": "string",
        "saldoDisponible": "number"
      }
    ]
  }
  ```
- **Usage:** Get savings accounts available as transfer destination

#### `/transfer/internal/targets/credits`

- **File:** `src/screens/InternalTransfersDestination.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:**
  ```json
  {
    "payload": [
      {
        "idCuenta": "string",
        "tipoCartera": "string",
        "numeroCuenta": "string",
        "codigoProducto": "string",
        "nombreProducto": "string",
        "codigoProductoCobis": "string",
        "cupoDisponible": "number"
      }
    ]
  }
  ```
- **Usage:** Get credit accounts available as transfer destination

#### `/transfer/internal/targets/investments`

- **File:** `src/screens/InternalTransfersDestination.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:**
  ```json
  {
    "payload": [
      {
        "idCuenta": "string",
        "numeroCuenta": "string",
        "alias": "string",
        "nombreProducto": "string",
        "codigoProductoCobis": "string",
        "saldoDisponible": "number"
      }
    ]
  }
  ```
- **Usage:** Get investment accounts available as transfer destination

#### `/transfer/internal/createTransaction`

- **File:** `src/screens/InternalTransfersVerification.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "origen": {
      "codigoProductoCobis": "string",
      "idCuenta": "string",
      "numeroCuenta": "string",
      "tipoCartera": "string (optional)"
    },
    "destino": { ...destination account },
    "valorTransferencia": "number",
    "otp": "string"
  }
  ```

---

### 7. External Transfers Domain (Banks)

#### `/transfer/external/sources/savings`

- **File:** `src/screens/ExternalTransfersSource.js`
- **Auth:** Bearer Token

#### `/transfer/external/sources/credits`

- **File:** `src/screens/ExternalTransfersSource.js`
- **Auth:** Bearer Token

#### `/transfer/external/listBanks`

- **File:** `src/screens/ExternalTransfersDestination.js`
- **Auth:** Bearer Token
- **Request:** `{}`
- **Response:**
  ```json
  { "payload": [{ "code": "string", "name": "string" }] }
  ```

#### `/transfer/external/getTransactionCost`

- **File:** `src/screens/ExternalTransfersCost.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "origen": { ...source account },
    "destino": { "name": "string", ...destination payload },
    "valorTransferencia": "number"
  }
  ```
- **Response:**
  ```json
  { "payload": { "comision": "number" } }
  ```

#### `/transfer/external/banks/createTransaction`

- **File:** `src/screens/ExternalTransfersVerification.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "otp": "string",
    "origen": { ...source },
    "destino": { "name": "string", ...destination },
    "valorTransferencia": "number"
  }
  ```

---

### 8. External Transfers Domain (Coopcentral Entities)

#### `/transfer/external/listEntities`

- **File:** `src/screens/CoopTransfersDestination.js`
- **Auth:** Bearer Token
- **Response:** List of Coopcentral cooperative entities

#### `/transfer/external/entities/targets/queryProduct`

- **File:** `src/screens/CoopTransfersDestination.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "destino": {
      "documentType": "string",
      "documentNumber": "string",
      "accountNumber": "string",
      "accountType": "string",
      "entityCode": "string"
    }
  }
  ```

#### `/transfer/external/entities/createTransaction`

- **File:** `src/screens/CoopTransfersVerification.js`
- **Auth:** Bearer Token

---

### 9. External Transfers Domain (Transfiya)

#### `/transfer/external/transfiya/getTransactionCost`

- **File:** `src/screens/TransfiyaTransfersVerification.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "origen": { ...source account },
    "valorTransferencia": "number"
  }
  ```

#### `/transfer/external/transfiya/createTransaction`

- **File:** `src/screens/TransfiyaTransfersVerification.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "otp": "string",
    "valorTransferencia": "number",
    "description": "string",
    "origen": { ...source },
    "destino": { "mobile": "string" },
    "deviceFingerPrint": {
      "hash": "string",
      "ipAddress": "string",
      "country": "string",
      "city": "string",
      "mobileDevice": "string",
      "operator": "string"
    }
  }
  ```

---

### 10. Transaction OTP

#### `/send-otp/transaction`

- **Files:** Multiple transfer/payment screens
- **Auth:** None
- **Request:**
  ```json
  {
    "documentNumber": "string",
    "documentType": "string",
    "trnType": "PaymentInternal|TransferInternal|TransferExternalBanks|TransferExternalEntities|TransferExternalTransfiYa"
  }
  ```
- **Response:**
  ```json
  { "payload": { "mobile": "string" } }
  ```

---

### 11. BRE-B Domain (Key-Based Transfers)

#### `/bre-b/keys/list`

- **File:** `src/screens/breb/KeyList.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "user": "string (fullName)",
    "userAgentString": "string",
    "trademark": "string",
    "model": "string",
    "platform": "ios|android",
    "versionPlatform": "string",
    "ip": "string"
  }
  ```
- **Response:**
  ```json
  { "payload": { "keysCustomers": [...] } }
  ```

#### `/bre-b/keys/resolve`

- **File:** `src/screens/breb/TxInput.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "valueKeyCustomer": "string",
    "user": "string",
    "documentType": "string",
    "documentNumber": "string",
    "ip": "string",
    ...deviceInfo
  }
  ```
- **Response:**
  ```json
  {
    "payload": {
      "firstName": "string",
      "surname": "string",
      "identification": "string",
      "typeIdentification": "string",
      "keysCustomers": [...]
    }
  }
  ```

#### `/bre-b/keys/create`

- **File:** `src/screens/breb/KeyConfirmation.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "typeKeyCustomer": "string",
    "valueKeyCustomer": "string",
    "sourceNumberAccount": "string",
    "sourceTypeAccount": "string",
    "sourceSubTypeAccount": "string (optional)",
    "sourceTypeAccountDescription": "string",
    "documentType": "string",
    "user": "string",
    "documentNumber": "string",
    "firstName": "string",
    "surName": "string",
    ...deviceInfo
  }
  ```

#### `/bre-b/keys/update`

- **File:** `src/screens/breb/KeyEdit.js`
- **Auth:** Bearer Token
- **Request:** Same as create with added `idKeyCustomer`

#### `/bre-b/keys/delete`, `/bre-b/keys/block`, `/bre-b/keys/unblock`

- **File:** `src/screens/breb/KeyActions.js`
- **Auth:** Bearer Token
- **Request:** Same structure as update

#### `/bre-b/accounts/list`

- **Files:** `src/screens/breb/AccountSelection.js`, `src/screens/breb/KeyEdit.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "indPag": "0"
  }
  ```
- **Response:**
  ```json
  {
    "payload": [
      {
        "numeroCuenta": "string",
        "tipoCuenta": "string",
        "subtipoCuenta": "string",
        "nombreProducto": "string"
      }
    ]
  }
  ```

#### `/bre-b/txs/init`

- **File:** `src/screens/breb/TxStatus.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "sourceNumberAccount": "string",
    "sourceTypeAccount": "string",
    "sourceSubTypeAccount": "string (optional)",
    "sourceTypeAccountDescription": "string",
    "user": "string",
    "documentType": "string",
    "documentNumber": "string",
    "sourceFirstName": "string",
    "sourceSurName": "string",
    "targetNode": "string",
    "targetResolutionId": "string",
    "targetValueKeyCustomer": "string",
    "targetTypeKeyCustomer": "string",
    "targetEntity": "string",
    "targetNumberAccount": "string",
    "targetTypeAccount": "string",
    "targetSubTypeAccount": "string (optional)",
    "targetTypeAccountDescription": "string",
    "targetIdentification": "string",
    "targetTypeIdentification": "string",
    "targetFirstName": "string",
    "targetSurName": "string",
    "amount": "number",
    ...deviceInfo
  }
  ```
- **Response:**
  ```json
  { "payload": { "paymentId": "string", "sequence": "string" } }
  ```

#### `/bre-b/txs/status`

- **File:** `src/screens/breb/TxStatus.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "user": "string",
    "paymentId": "string",
    ...deviceInfo
  }
  ```
- **Response:**
  ```json
  {
    "payload": {
      "stateCodePayment": "SCHD|PROC|ACPT|STTL|RTRN|CNCL|TIMEOUT",
      "statePaymentDescription": "string",
      "stateDescriptionCustomer": "string"
    }
  }
  ```

#### `/bre-b/txs/list`

- **File:** `src/screens/breb/TxHistory.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "initialDate": "string (YYYYMMDD)",
    "finalDate": "string (YYYYMMDD)",
    "initialHour": "string",
    "finalHour": "string"
  }
  ```
- **Response:**
  ```json
  { "payload": { "movements": [...] } }
  ```

#### `/bre-b/terms/accept`

- **File:** `src/screens/breb/KeySelection.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  {
    "documentType": "string",
    "documentNumber": "string",
    "user": "string (fullName)",
    "ip": "string"
  }
  ```
- **Usage:** Accept BRE-B terms and conditions for first-time key registration

---

### 12. Products Domain

#### `/products/savings`

- **File:** `src/screens/SavingsBalances.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:**
  ```json
  {
    "payload": [
      {
        "numeroCuenta": "string",
        "alias": "string",
        "saldoDisponible": "number",
        "codigoProductoCobis": "string",
        "idCuenta": "string",
        "nombreProducto": "string",
        "saldoTotal": "number"
      }
    ]
  }
  ```
- **Usage:** Get detailed list of user's savings accounts

#### `/products/credits`

- **File:** `src/screens/CreditBalance.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:**
  ```json
  {
    "payload": [
      {
        "numeroCuenta": "string",
        "cupoDisponible": "number",
        "saldo": "number",
        "fechaCorte": "string",
        "periodoFacturado": "string",
        "codigoProductoCobis": "string",
        "tipoCartera": "string",
        "idCuenta": "string",
        "fechaPago": "string",
        "pagoMinimo": "number",
        "codigoProducto": "string",
        "diasMora": "number",
        "pagoTotal": "number"
      }
    ]
  }
  ```
- **Usage:** Get detailed list of user's credit accounts

#### `/products/investments`

- **File:** `src/screens/InvestmentBalances.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:**
  ```json
  {
    "payload": [
      {
        "numeroCuenta": "string",
        "tasaEfectiva": "number",
        "codigoProductoCobis": "number",
        "idCuenta": "string",
        "cuota": "number",
        "nombreProducto": "string",
        "fechaVencimiento": "string",
        "plazo": "number",
        "saldoTotal": "number"
      }
    ]
  }
  ```
- **Usage:** Get detailed list of user's investment products (CDAT, PAC)
- **Note:** `codigoProductoCobis === 4` indicates PAC, `21` indicates CDAT

#### `/products/contributions`

- **File:** `src/screens/ContributionsBalance.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:**
  ```json
  {
    "payload": {
      "aportes": {
        "idCuentaAportes": "string",
        "numeroCuentaAportes": "string",
        "codigoProductoCobisAportes": "string",
        "saldoTotalAportes": "number",
        "aportesMora": "number",
        "aportesVigentes": "number",
        "fechaCubrimientoAportes": "string",
        "fondosSolidariosMora": "number",
        "fondosSolidariosVigentes": "number",
        "fechaCubrimientoFondosSolidarios": "string"
      },
      "ahorroPermanente": {
        "numeroCuentaAhorroPermanente": "string",
        "saldoDisponibleAhorroPermanente": "number",
        "codigoProductoCobisAhorroPermanente": "string",
        "idCuentaAhorroPermanente": "string",
        "saldoTotalAhorroPermanente": "number"
      }
    }
  }
  ```
- **Usage:** Get user's contributions (aportes) and permanent savings

#### `/products/protection`

- **File:** `src/screens/ProtectionBalance.js`
- **Auth:** Bearer Token
- **Request:**
  ```json
  { "documentType": "string", "documentNumber": "string" }
  ```
- **Response:**
  ```json
  {
    "payload": [
      {
        "numeroCuenta": "string",
        "codigoProductoCobis": "string",
        "idCuenta": "string",
        "fechaPago": "string",
        "pagoMinimo": "number",
        "nombreProducto": "string",
        "pagoTotal": "number"
      }
    ]
  }
  ```
- **Usage:** Get user's protection/insurance products

---

## Error Handling

### Status Codes

| Code  | Meaning      | Action                   |
| ----- | ------------ | ------------------------ |
| 0     | Success      | Process response         |
| 107   | Unauthorized | Navigate to `SessionEnd` |
| Other | Error        | Display error message    |

### Special State Codes

| Code | Meaning      | Handling                |
| ---- | ------------ | ----------------------- |
| U119 | Empty result | Return empty array `[]` |

### Error Message Extraction

Priority order:

1. `responseData.payload.error.stateDescriptionCustomer`
2. `responseData.statusDesc`

### Error UI Components

- `ErrorModal` - Full screen modal (`src/molecules/modals/ErrorModal.js`)
- `ErrorMessage` - Inline error display (`src/atoms/ErrorMessage.js`)
- Special handling for "NO EXISTE EL CLIENTE INDICADO"

---

## External Services

### IP Address Lookup

- **URL:** `http://ip-api.com/json` (HTTP, not HTTPS)
- **File:** `src/hooks/useInfo.js`
- **Method:** GET (native fetch, not useResource)
- **Response field:** `query`

---

## Observations & Recommendations

### Findings

1. **All requests are POST** - Even for data retrieval (GET semantics)
2. **No token persistence** - Token only in React state, lost on app restart
3. **No token refresh** - 401 immediately ends session
4. **Fixed timeout** - 30 seconds for all operations regardless of complexity
5. **IP lookup uses HTTP** - `http://ip-api.com/json` should use HTTPS

### Consistency Notes

1. **Base URL is environment-based** - Configured correctly
2. **Auth header consistent** - `Authorization: Bearer ${token}`
3. **Error handling centralized** - useResource hook
4. **Device fingerprint pattern consistent** - Used in BRE-B module

### Common Request Patterns

**User Identification (most endpoints):**

```json
{ "documentType": "string", "documentNumber": "string" }
```

**Device Info (BRE-B only):**

```json
{
  "ip": "string",
  "userAgentString": "string",
  "trademark": "string",
  "model": "string",
  "platform": "ios|android",
  "versionPlatform": "string"
}
```

**Source Account:**

```json
{
  "codigoProductoCobis": "string",
  "idCuenta": "string",
  "numeroCuenta": "string",
  "tipoCartera": "string (optional, for credits)"
}
```

---

## Files Reference

| Category                       | File Path                                     |
| ------------------------------ | --------------------------------------------- |
| HTTP Client                    | `src/hooks/useResource.js`                    |
| Auth Context                   | `src/context/account.provider.js`             |
| Auth Hook                      | `src/hooks/useAccount.js`                     |
| Inactivity                     | `src/hooks/useInactivity.js`                  |
| Device Info                    | `src/hooks/useInfo.js`                        |
| Error Modal                    | `src/molecules/modals/ErrorModal.js`          |
| Session End                    | `src/screens/SessionEnd.js`                   |
| Internal Transfers Source      | `src/screens/InternalTransfersSource.js`      |
| Internal Transfers Destination | `src/screens/InternalTransfersDestination.js` |
| BRE-B Key Selection            | `src/screens/breb/KeySelection.js`            |
| Savings Products               | `src/screens/SavingsBalances.js`              |
| Credit Products                | `src/screens/CreditBalance.js`                |
| Investment Products            | `src/screens/InvestmentBalances.js`           |
| Contributions Products         | `src/screens/ContributionsBalance.js`         |
| Protection Products            | `src/screens/ProtectionBalance.js`            |
| Env Dev                        | `.env.development`                            |
| Env Prod                       | `.env.production`                             |
