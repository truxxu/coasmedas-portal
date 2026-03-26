# Coasmedas Mobile App API Documentation

> **Source file:** `Flows/Cerp_Coasmedas_WSAppMovil.cerpconfig.jsonc`
> **Generated from:** Static analysis of CERP Engine flow configuration (37,759 lines)

---

## 1. Overview

- **Protocol:** HTTP POST (all endpoints)
- **Content-Type:** `application/json`
- **Base routing:** Single entry point routes requests via `PathMap` to internal flows based on the URL path
- **Authentication:** JWT Bearer token (RS256) for protected endpoints; OTP-based for public endpoints
- **Response envelope:** `{"statusCode": <int>, "statusDesc": "<string>", "payload"?: <object|array>}`

---

## 2. Endpoint Summary

| #   | Path                                               | Auth           | Description                                         |
| --- | -------------------------------------------------- | -------------- | --------------------------------------------------- |
| 1   | `/register`                                        | OTP            | Register a new user                                 |
| 2   | `/register-device`                                 | OTP            | Register a new device                               |
| 3   | `/login`                                           | OTP + Password | Authenticate and obtain JWT                         |
| 4   | `/send-otp`                                        | None           | Send OTP via SMS                                    |
| 5   | `/send-otp/transaction`                            | JWT            | Send OTP for transaction confirmation               |
| 6   | `/update-password`                                 | OTP            | Update user password                                |
| 7   | `/get-salt`                                        | JWT            | Retrieve password salt                              |
| 8   | `/balances`                                        | JWT            | Query account balances                              |
| 9   | `/products/contributions`                          | JWT            | Query contribution (aportes) products               |
| 10  | `/products/savings`                                | JWT            | Query savings products                              |
| 11  | `/products/investments`                            | JWT            | Query investment products                           |
| 12  | `/products/credits`                                | JWT            | Query credit products                               |
| 13  | `/products/protection`                             | JWT            | Query protection/insurance products                 |
| 14  | `/movements`                                       | JWT            | Query account movements                             |
| 15  | `/transfer/internal/createTransaction`             | JWT + OTP      | Execute internal transfer                           |
| 16  | `/transfer/external/listBanks`                     | JWT            | List available banks (Visionamos)                   |
| 17  | `/transfer/external/listEntities`                  | JWT            | List available entities (Visionamos)                |
| 18  | `/transfer/internal/sources/savings`               | JWT            | List savings accounts as transfer sources           |
| 19  | `/transfer/internal/sources/credits`               | JWT            | List credit accounts as transfer sources            |
| 20  | `/transfer/internal/sources/investments`           | JWT            | List investment accounts as transfer sources        |
| 21  | `/transfer/internal/targets/savings`               | JWT            | List savings accounts as transfer targets           |
| 22  | `/transfer/internal/targets/credits`               | JWT            | List credit accounts as transfer targets            |
| 23  | `/transfer/internal/targets/investments`           | JWT            | List investment accounts as transfer targets        |
| 24  | `/transfer/external/sources/savings`               | JWT            | List savings accounts for external transfer sources |
| 25  | `/transfer/external/sources/credits`               | JWT            | List credit accounts for external transfer sources  |
| 26  | `/transfer/external/entities/targets/queryProduct` | JWT            | Validate external destination account               |
| 27  | `/transfer/external/entities/createTransaction`    | JWT + OTP      | Execute external transfer (entities)                |
| 28  | `/transfer/external/banks/createTransaction`       | JWT + OTP      | Execute external transfer (banks)                   |
| 29  | `/transfer/external/getTransactionCost`            | JWT            | Get external transfer cost/commission               |
| 30  | `/transfer/external/transfiya/createTransaction`   | JWT + OTP      | Execute TransfiYa transfer                          |
| 31  | `/transfer/external/transfiya/getTransactionCost`  | JWT            | Get TransfiYa transfer cost                         |
| 32  | `/payment/products`                                | JWT            | List products available for payment                 |
| 33  | `/payment/payzen/createTransaction`                | JWT            | Create Payzen payment link                          |
| 34  | `/payment/internal/sources/savings`                | JWT            | List savings accounts for payment sources           |
| 35  | `/payment/internal/sources/credits`                | JWT            | List credit accounts for payment sources            |
| 36  | `/payment/internal/createTransaction`              | JWT + OTP      | Execute internal payment                            |
| 37  | `/userValidation`                                  | JWT            | Validate user exists                                |
| 38  | `/bre-b/accounts/list`                             | JWT            | List BRE-B eligible accounts                        |
| 39  | `/bre-b/keys/create`                               | JWT            | Create BRE-B key                                    |
| 40  | `/bre-b/keys/list`                                 | JWT            | List BRE-B keys                                     |
| 41  | `/bre-b/keys/resolve`                              | JWT            | Resolve BRE-B key                                   |
| 42  | `/bre-b/keys/block`                                | JWT            | Block BRE-B key                                     |
| 43  | `/bre-b/keys/unblock`                              | JWT            | Unblock BRE-B key                                   |
| 44  | `/bre-b/keys/update`                               | JWT            | Update BRE-B key                                    |
| 45  | `/bre-b/keys/delete`                               | JWT            | Delete BRE-B key                                    |
| 46  | `/bre-b/terms/accept`                              | JWT            | Accept BRE-B terms                                  |
| 47  | `/bre-b/txs/init`                                  | JWT            | Initiate BRE-B transaction                          |
| 48  | `/bre-b/txs/list`                                  | JWT            | List BRE-B transactions                             |
| 49  | `/bre-b/txs/status`                                | JWT            | Check BRE-B transaction status                      |

---

## 3. Authentication

### JWT (Protected Endpoints)

- **Header:** `Authorization: Bearer <token>`
- **Algorithm:** RS256 (signed with PFX certificate)
- **Claims:** `{ "iss": "CERP", "sub": "<documentNumber>", "exp": <unix_timestamp> }`
- **Validation flow:** `ValJwtFlow` extracts Bearer token, verifies RS256 signature, checks expiration
- **Issued by:** `GenJwtFlow` after successful login

### OTP (Public/Transaction Endpoints)

- Sent via SMS through Inalambria service
- Stored as BCrypt hash in `Cerp_Coasmedas_OTP` table
- Validated via `ValOtpFlow` (registration/login) or `ValOtpTrnFlow` (transactions)
- 6-digit numeric code (range: 0-999999)

---

## 4. Endpoint Details

---

### 4.1 `/register`

**Auth:** OTP | **Flow:** `RegisterFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "password": "<bcrypt_hash_60_chars>",
  "salt": "<bcrypt_salt_29_chars>",
  "otp": "123456"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "address": "<string>",
    "city": "<string>",
    "documentType": "<string>",
    "documentNumber": <number>,
    "email": "<string>",
    "mobile": <number>,
    "fullName": "<string>",
    "phone": <number>,
    "state": "<string>",
    "token": "string"
  }
}
```

> **Note:** `token` is a literal `"string"` placeholder -- no JWT is generated during registration.

---

### 4.2 `/register-device`

**Auth:** OTP | **Flow:** `RegisterDeviceFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "deviceId": "<device_uuid>",
  "deviceDescription": "<device_description>",
  "otp": "123456"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Dispositivo registrado exitosamente"
}
```

---

### 4.3 `/login`

**Auth:** OTP + Password | **Flow:** `LoginFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "password": "<bcrypt_hash_60_chars>",
  "otp": "123456",
  "deviceId": "<device_uuid>"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "address": "<string>",
    "city": "<string>",
    "documentType": "<string>",
    "documentNumber": <number>,
    "email": "<string>",
    "mobile": <number>,
    "fullName": "<string>",
    "phone": <number>,
    "state": "<string>",
    "token": "<JWT_string>"
  }
}
```

> Password verification: BCrypt hash comparison + HMAC-SHA256 pepper with server-side key.

---

### 4.4 `/send-otp`

**Auth:** None | **Flow:** `SendOTPFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:**

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

> Contact info is masked in the response for privacy.

---

### 4.5 `/send-otp/transaction`

**Auth:** JWT | **Flow:** `SendOTPTransactionFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "trnType": "<transaction_type>"
}
```

**Success Response:**

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

### 4.6 `/update-password`

**Auth:** OTP | **Flow:** `UpdatePasswordFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "password": "<new_bcrypt_hash_60_chars>",
  "salt": "<new_bcrypt_salt_29_chars>",
  "otp": "123456"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "address": "<string>",
    "city": "<string>",
    "documentType": "<string>",
    "documentNumber": <number>,
    "email": "<string>",
    "mobile": <number>,
    "fullName": "<string>",
    "phone": <number>,
    "state": "<string>"
  }
}
```

---

### 4.7 `/get-salt`

**Auth:** JWT | **Flow:** `GetSaltFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "salt": "<bcrypt_salt_29_chars>"
  }
}
```

---

### 4.8 `/balances`

**Auth:** JWT | **Flow:** `BalancesFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "producto": "<string>",
      "saldo": "<string>"
    }
  ]
}
```

> **MapFrame:** `MapFrameRespuestaConsultaSaldosCuentas.json` -- fields: `productoTemp`(10), `saldoTemp`(15)

---

### 4.9 `/products/contributions`

**Auth:** JWT | **Flow:** `ProductsContributionsFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response (full variant -- when ahorroPermanente exists):**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "aportes": {
      "saldoTotalAportes": "<decimal>",
      "aportesVigentes": "<decimal>",
      "aportesMora": "<decimal>",
      "fechaCubrimientoAportes": "<string>",
      "fondosSolidariosVigentes": "<decimal>",
      "fondosSolidariosMora": "<decimal>",
      "fechaCubrimientoFondosSolidarios": "<string>",
      "numeroCuentaAportes": "<string>",
      "idCuentaAportes": "<string>",
      "codigoProductoCobisAportes": <number>
    },
    "ahorroPermanente": {
      "saldoTotalAhorroPermanente": "<decimal>",
      "saldoDisponibleAhorroPermanente": "<decimal>",
      "numeroCuentaAhorroPermanente": "<string>",
      "idCuentaAhorroPermanente": "<string>",
      "codigoProductoCobisAhorroPermanente": <number>
    }
  }
}
```

> If `idCuentaAhorroPermanente == 0`, the `ahorroPermanente` key is omitted from the payload.
>
> **MapFrame:** `MapFrameRespuestaProductosAportes.json` -- monetary fields use `ValorConDecimales` type (last 2 digits = decimals).

---

### 4.10 `/products/savings`

**Auth:** JWT | **Flow:** `ProductsSavingsFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "numeroCuenta": "<string>",
      "alias": "<string>",
      "nombreProducto": "<string>",
      "saldoDisponible": "<string>",
      "saldoTotal": "<string>",
      "idCuenta": "<string>",
      "codigoProductoCobis": "<string>"
    }
  ]
}
```

> **MapFrame:** `MapFrameRespuestaProductosAhorrosCuentas.json` -- also includes `indicadorTransaccionesInternas` and `indicadorTransaccionesExternasYPagos` in the raw frame (not serialized to response).

---

### 4.11 `/products/investments`

**Auth:** JWT | **Flow:** `ProductsInvestmentsFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "numeroCuenta": "<string>",
      "nombreProducto": "<string>",
      "cuota": "<string>",
      "saldoTotal": "<string>",
      "plazo": "<string>",
      "fechaVencimiento": "<string>",
      "tasaEfectiva": "<string>",
      "idCuenta": "<string>",
      "codigoProductoCobis": "<string>"
    }
  ]
}
```

> **MapFrame:** `MapFrameRespuestaProductosInversionesCuentas.json`

---

### 4.12 `/products/credits`

**Auth:** JWT | **Flow:** `ProductsCreditsFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "numeroCuenta": "<string>",
      "codigoProducto": "<string>",
      "nombreProducto": "<string>",
      "saldo": "<string>",
      "cupoDisponible": "<string>",
      "pagoMinimo": "<string>",
      "pagoTotal": "<string>",
      "diasMora": "<string>",
      "fechaPago": "<string>",
      "fechaCorte": "<string>",
      "periodoFacturado": "<string>",
      "tipoCartera": "<string>",
      "idCuenta": "<string>",
      "codigoProductoCobis": "<string>"
    }
  ]
}
```

> **MapFrame:** `MapFrameRespuestaProductosCreditosCuentas.json`

---

### 4.13 `/products/protection`

**Auth:** JWT | **Flow:** `ProductsProtectionFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "numeroCuenta": "<string>",
      "nombreProducto": "<string>",
      "pagoMinimo": "<string>",
      "pagoTotal": "<string>",
      "diasMora": "<string>",
      "fechaPago": "<string>",
      "idCuenta": "<string>",
      "codigoProductoCobis": "<string>"
    }
  ]
}
```

> **MapFrame:** `MapFrameRespuestaProductosProteccionCuentas.json`

---

### 4.14 `/movements`

**Auth:** JWT | **Flow:** `MovementsFlow`

**Request Body:**

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

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "fechaTransaccion": "<yyyyMMdd>",
      "horaTransaccion": "<HHmmss>",
      "referencia": "<string>",
      "tipoTransaccion": "<string>",
      "valorTransaccion": "<string>",
      "saldoPorTrn": "<string>",
      "descripcion": "<string>"
    }
  ]
}
```

> **MapFrame:** `MapFrameRespuestaMovimientosMovimientos.json`
> Returns `{"statusCode":0,"statusDesc":"Transaccion exitosa","payload":[]}` when no movements found.

---

### 4.15 `/transfer/internal/createTransaction`

**Auth:** JWT + OTP | **Flow:** `TransferInternalFlow`

**Request Body:**

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

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "numAprobacion": <number>,
    "fechaTrn": "<yyyyMMdd>",
    "horaTrn": <number>,
    "valorTransferencia": <number>
  }
}
```

---

### 4.16 `/transfer/external/listBanks`

**Auth:** JWT | **Flow:** `ListBanksVisionamosFlow`

**Request Body:** `{}` (no required fields)

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [{ "code": "<string>", "name": "<string>" }]
}
```

> Third-party: Calls Visionamos API (GET). Response is the Visionamos bank list wrapped in the standard envelope.

---

### 4.17 `/transfer/external/listEntities`

**Auth:** JWT | **Flow:** `ListEntitiesVisionamosFlow`

**Request Body:** `{}` (no required fields)

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [{ "code": "<string>", "name": "<string>" }]
}
```

> Third-party: Calls Visionamos API (GET). Response wrapped in standard envelope.

---

### 4.18 `/transfer/internal/sources/savings`

**Auth:** JWT | **Flow:** `TransferInternalSourcesSavingsFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:** Same structure as `/products/savings` (section 4.10).

> **Reuse:** Also used for `/transfer/external/sources/savings` and `/payment/internal/sources/savings`.

---

### 4.19 `/transfer/internal/sources/credits`

**Auth:** JWT | **Flow:** `TransferInternalSourcesCreditsFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:** Same structure as `/products/credits` (section 4.12).

> **Reuse:** Also used for `/transfer/external/sources/credits` and `/payment/internal/sources/credits`.

---

### 4.20 `/transfer/internal/sources/investments`

**Auth:** JWT | **Flow:** `TransferInternalSourcesInvestmentsFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:** Same structure as `/products/investments` (section 4.11).

---

### 4.21 `/transfer/internal/targets/savings`

**Auth:** JWT | **Flow:** `TransferInternalTargetsSavingsFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:** Same structure as `/products/savings` (section 4.10).

---

### 4.22 `/transfer/internal/targets/credits`

**Auth:** JWT | **Flow:** `TransferInternalTargetsCreditsFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:** Same structure as `/products/credits` (section 4.12).

---

### 4.23 `/transfer/internal/targets/investments`

**Auth:** JWT | **Flow:** `TransferInternalTargetsInvestmentsFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:** Same structure as `/products/investments` (section 4.11).

---

### 4.24 `/transfer/external/sources/savings`

**Auth:** JWT | **Flow:** `TransferInternalSourcesSavingsFlow` (reused)

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:** Same structure as `/products/savings` (section 4.10).

---

### 4.25 `/transfer/external/sources/credits`

**Auth:** JWT | **Flow:** `TransferInternalSourcesCreditsFlow` (reused)

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:** Same structure as `/products/credits` (section 4.12).

---

### 4.26 `/transfer/external/entities/targets/queryProduct`

**Auth:** JWT | **Flow:** `TransferExternalTargetsQueryProductFlow`

**Request Body:**

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

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa"
}
```

> No payload -- confirmation only. Third-party: Calls Visionamos API to validate the destination account.

---

### 4.27 `/transfer/external/entities/createTransaction`

**Auth:** JWT + OTP | **Flow:** `TransferExternalEntitiesCreateTransactionFlow`

**Request Body:**

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

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "numAprobacion": "<string>",
    "fechaTrn": "<string>",
    "horaTrn": "<string>",
    "valorTransferencia": <number>
  }
}
```

> Third-party: Calls Visionamos API. `numAprobacion` is a string (from Visionamos `approvalNumber`).

---

### 4.28 `/transfer/external/banks/createTransaction`

**Auth:** JWT + OTP | **Flow:** `TransferExternalBanksCreateTransactionFlow`

**Request Body:** Same structure as `/transfer/external/entities/createTransaction` (section 4.27).

**Success Response:** Same structure as `/transfer/external/entities/createTransaction` (section 4.27).

---

### 4.29 `/transfer/external/getTransactionCost`

**Auth:** JWT | **Flow:** `TransferExternalGetTransactionCostFlow`

**Request Body:**

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

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "numAprobacion": "<string>",
    "comision": <number>
  }
}
```

> Third-party: Calls Visionamos API. `comision` is a decimal number.

---

### 4.30 `/transfer/external/transfiya/createTransaction`

**Auth:** JWT + OTP | **Flow:** `TransferExternalTransfiyaCreateTransactionFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "otp": "123456",
  "valorTransferencia": 50000,
  "description": "Payment description",
  "origen": {
    "codigoProductoCobis": "01",
    "tipoCartera": "0",
    "idCuenta": "1234567890",
    "numeroCuenta": "12345678901234567890"
  },
  "destino": {
    "mobile": "3001234567"
  },
  "deviceFingerPrint": {
    "hash": "<string>",
    "ipAddress": "<string>",
    "geolocation": "<string>",
    "country": "<string>",
    "city": "<string>",
    "mobileDevice": "<string>",
    "SIMCardId": "<string>",
    "model": "<string>",
    "operator": "<string>"
  }
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "numAprobacion": "<string>",
    "fechaTrn": "<string>",
    "horaTrn": "<string>",
    "valorTransferencia": <number>
  }
}
```

> Third-party: Calls TransfiYa/Visionamos API. `numAprobacion` comes from `Respuesta_Cus` field.

---

### 4.31 `/transfer/external/transfiya/getTransactionCost`

**Auth:** JWT | **Flow:** `TransferExternalTransfiyaGetTransactionCostFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "valorTransferencia": 50000,
  "origen": {
    "codigoProductoCobis": "01",
    "tipoCartera": "0",
    "idCuenta": "1234567890"
  }
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "numAprobacion": "<string>",
    "comision": <number>
  }
}
```

---

### 4.32 `/payment/products`

**Auth:** JWT | **Flow:** `ProductsToPayFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "tipoProducto": "<string>",
      "descProducto": "<string>",
      "numeroCuenta": "<string>",
      "pagoMinimo": "<string>",
      "idCuenta": "<string>",
      "alias": "<string>"
    }
  ]
}
```

> **MapFrame:** `MapFrameRespuestaProductosAPagarCuentas.json`

---

### 4.33 `/payment/payzen/createTransaction`

**Auth:** JWT | **Flow:** `CreatePaymentPayzenFlow`

**Request Body:**

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

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "paymentUrl": "<URL_string>"
  }
}
```

> Third-party: Calls Payzen API. Returns a payment URL for the user to complete the transaction.

---

### 4.34 `/payment/internal/sources/savings`

**Auth:** JWT | **Flow:** `TransferInternalSourcesSavingsFlow` (reused)

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:** Same structure as `/products/savings` (section 4.10).

---

### 4.35 `/payment/internal/sources/credits`

**Auth:** JWT | **Flow:** `TransferInternalSourcesCreditsFlow` (reused)

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:** Same structure as `/products/credits` (section 4.12).

---

### 4.36 `/payment/internal/createTransaction`

**Auth:** JWT + OTP | **Flow:** `CreatePaymentInternalFlow`

**Request Body:**

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
  }
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "numAprobacion": <number>,
    "fechaTrn": "<yyyyMMdd>",
    "horaTrn": <number>,
    "vlrPagoTotal": <number>
  }
}
```

---

### 4.37 `/userValidation`

**Auth:** JWT | **Flow:** `UserValidationFlow`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa"
}
```

> No payload -- confirmation only.

---

### 4.38 `/bre-b/accounts/list`

**Auth:** JWT | **Flow:** `BreBAccountsListFlowInit`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "indPag": "1"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": [
    {
      "numeroCuenta": "<string>",
      "aliasCuenta": "<string>",
      "nombreProducto": "<string>",
      "tipoCuenta": "<string>",
      "subtipoCuenta": "<string>",
      "codigoProductoCobis": "<string>",
      "idCuentaAhorroPermanente": "<string>"
    }
  ]
}
```

> Queries core banking via stored procedure, parses response using `MapFrameRespuestaDataBreBCuentas.json`.
> Returns `{"statusCode":0,"statusDesc":"Transaccion exitosa","payload":[]}` when no accounts found.

---

### 4.39 `/bre-b/keys/create`

**Auth:** JWT | **Flow:** `BreBKeysCreateFlowInit`

**Request Body:**

```json
{
  "typeKeyCustomer": "<string>",
  "valueKeyCustomer": "<string>",
  "sourceNumberAccount": "<string>",
  "sourceTypeAccount": "<string>",
  "sourceSubTypeAccount": "<string>",
  "sourceTypeAccountDescription": "<string>",
  "user": "<string>",
  "firstName": "<string>",
  "surName": "<string>",
  "documentNumber": "1234567890",
  "documentType": "CC",
  "ip": "<string>",
  "userAgentString": "<string>",
  "trademark": "<string>",
  "model": "<string>",
  "platform": "<string>",
  "versionPlatform": "<string>"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "stateCode": "<string>"
  }
}
```

> Third-party: Proxies to Visionamos BRE-B keys API. Authenticates with Visionamos JWT before calling.

---

### 4.40 `/bre-b/keys/list`

**Auth:** JWT | **Flow:** `BreBKeysListFlowInit`

**Request Body:**

```json
{
  "user": "<string>",
  "documentNumber": "1234567890",
  "documentType": "CC",
  "ip": "<string>",
  "userAgentString": "<string>",
  "trademark": "<string>",
  "model": "<string>",
  "platform": "<string>",
  "versionPlatform": "<string>"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {
    "keysCustomers": []
  }
}
```

> Third-party: Proxies to Visionamos BRE-B keys API. Returns `keysCustomers` array (empty if none found).

---

### 4.41 `/bre-b/keys/resolve`

**Auth:** JWT | **Flow:** `BreBKeysResolveFlowInit`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "valueKeyCustomer": "<string>",
  "user": "<string>",
  "ip": "<string>",
  "userAgentString": "<string>",
  "trademark": "<string>",
  "model": "<string>",
  "platform": "<string>",
  "versionPlatform": "<string>"
}
```

> **Note:** `DefaultFields.json` includes a field `ike` in this path -- this appears to be a typo (likely should be removed or is `like`).

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {}
}
```

> Third-party: Proxies to Visionamos BRE-B keys resolve API. Payload contains the Visionamos response.

---

### 4.42 `/bre-b/keys/block`

**Auth:** JWT | **Flow:** `BreBKeysBlockFlowInit`

**Request Body:**

```json
{
  "idKeyCustomer": "<string>",
  "typeKeyCustomer": "<string>",
  "valueKeyCustomer": "<string>",
  "sourceNumberAccount": "<string>",
  "sourceTypeAccount": "<string>",
  "sourceSubTypeAccount": "<string>",
  "sourceTypeAccountDescription": "<string>",
  "user": "<string>",
  "firstName": "<string>",
  "surName": "<string>",
  "documentNumber": "1234567890",
  "documentType": "CC",
  "ip": "<string>",
  "userAgentString": "<string>",
  "trademark": "<string>",
  "model": "<string>",
  "platform": "<string>",
  "versionPlatform": "<string>"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {}
}
```

> Third-party: Proxies to Visionamos BRE-B keys API. Payload contains the Visionamos response.

---

### 4.43 `/bre-b/keys/unblock`

**Auth:** JWT | **Flow:** `BreBKeysUnblockFlowInit`

**Request Body:** Same structure as `/bre-b/keys/block` (section 4.42).

**Success Response:** Same structure as `/bre-b/keys/block` (section 4.42).

---

### 4.44 `/bre-b/keys/update`

**Auth:** JWT | **Flow:** `BreBKeysUpdateFlowInit`

**Request Body:** Same structure as `/bre-b/keys/block` (section 4.42).

**Success Response:** Same structure as `/bre-b/keys/block` (section 4.42).

---

### 4.45 `/bre-b/keys/delete`

**Auth:** JWT | **Flow:** `BreBKeysDeleteFlowInit`

**Request Body:** Same structure as `/bre-b/keys/block` (section 4.42).

**Success Response:** Same structure as `/bre-b/keys/block` (section 4.42).

---

### 4.46 `/bre-b/terms/accept`

**Auth:** JWT | **Flow:** `BreBTermsAcceptFlowInit`

**Request Body:**

```json
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "user": "<string>",
  "ip": "<string>"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {}
}
```

> Third-party: Proxies to Visionamos BRE-B terms API.

---

### 4.47 `/bre-b/txs/init`

**Auth:** JWT | **Flow:** `BreBTxsInitFlowInit`

**Request Body:**

```json
{
  "documentNumber": "1234567890",
  "documentType": "CC",
  "user": "<string>",
  "sourceFirstName": "<string>",
  "sourceSurName": "<string>",
  "sourceNumberAccount": "<string>",
  "sourceTypeAccount": "<string>",
  "sourceSubTypeAccount": "<string>",
  "sourceTypeAccountDescription": "<string>",
  "targetNode": "<string>",
  "targetResolutionId": "<string>",
  "targetValueKeyCustomer": "<string>",
  "targetTypeKeyCustomer": "<string>",
  "targetEntity": "<string>",
  "targetNumberAccount": "<string>",
  "targetTypeAccount": "<string>",
  "targetSubTypeAccount": "<string>",
  "targetTypeAccountDescription": "<string>",
  "targetIdentification": "<string>",
  "targetTypeIdentification": "<string>",
  "targetFirstName": "<string>",
  "targetSurName": "<string>",
  "amount": 50000,
  "ip": "<string>",
  "userAgentString": "<string>",
  "trademark": "<string>",
  "model": "<string>",
  "platform": "<string>",
  "versionPlatform": "<string>"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {}
}
```

> Third-party: Proxies to Visionamos BRE-B transactions API. Payload contains the Visionamos response.

---

### 4.48 `/bre-b/txs/list`

**Auth:** JWT | **Flow:** `BreBTxsListFlowInit`

**Request Body:**

```json
{
  "documentNumber": "1234567890",
  "documentType": "CC",
  "initialDate": 20240101,
  "initialHour": "000000",
  "finalDate": 20240131,
  "finalHour": "235959"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {}
}
```

> Third-party: Proxies to Visionamos BRE-B transactions list API. Payload contains the Visionamos response.

---

### 4.49 `/bre-b/txs/status`

**Auth:** JWT | **Flow:** `BreBTxsStatusFlowInit`

**Request Body:**

```json
{
  "documentNumber": "1234567890",
  "documentType": "CC",
  "user": "<string>",
  "paymentId": "<string>",
  "ip": "<string>",
  "userAgentString": "<string>",
  "trademark": "<string>",
  "model": "<string>",
  "platform": "<string>",
  "versionPlatform": "<string>"
}
```

**Success Response:**

```json
{
  "statusCode": 0,
  "statusDesc": "Transaccion exitosa",
  "payload": {}
}
```

> Third-party: Proxies to Visionamos BRE-B transaction status API. Payload contains the Visionamos response.

---

## 5. Error Responses

All error responses follow the same envelope:

```json
{
  "statusCode": <int>,
  "statusDesc": "<string>"
}
```

### Error Code Catalog

| Code      | Flow                                             | Description                                                                    |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------------------ |
| 0         | (success)                                        | Transaccion exitosa                                                            |
| 1         | `LoginErrorFlow`                                 | Error en login                                                                 |
| 2         | `ErrorRequestFlow`                               | No pasa validacion de formato                                                  |
| 4         | `UserRegisteredFlow`                             | Usuario ya esta registrado                                                     |
| 101       | `NotFoundUserFlow`                               | Usuario no encontrado                                                          |
| 102       | `CellphoneErrorFlow`                             | El celular guardado en el core tiene un formato erroneo                        |
| 103       | `EmailErrorFlow`                                 | El email guardado en el core tiene un formato erroneo                          |
| 105       | `SendToCoreErrorFlow`                            | Error en comunicacion con el core                                              |
| 106       | `OtpErradoFlow`                                  | OTP invalido                                                                   |
| 107       | `AuthorizationErrorFlow`                         | No autorizado para realizar esta operacion                                     |
| 108       | `ErrorVisionamosFlow`                            | Error consumiendo web service de Visionamos                                    |
| 109       | `RspCrearOrdenPagoPayzenWsErrorFlow`             | No se pudo generar el link de pago, error en el Web Service de Payzen: {error} |
| 110       | `RspCrearOrdenPagoPayzenErrorFlow`               | No se pudo generar el link de pago, Payzen responde: {detailedErrorMessage}    |
| 111       | `RspCrearOrdenPagoPayzenNoResponseFlow`          | Payzen no responde                                                             |
| 112       | `RspCreateTransactionVisionamosWsErrorFlow`      | No se pudo crear la transaccion en Visionamos, respuesta: {error}              |
| 113       | `RspCreateTransactionVisionamosErrorFlow`        | No se pudo autorizar la transaccion, Visionamos responde: {message}            |
| 114       | `RspCreateTransactionVisionamosWsNoResponseFlow` | Visionamos no responde                                                         |
| 115       | `RspTransfiYaErrorFlow`                          | No se pudo autorizar la transaccion, Visionamos responde: {Mensaje}            |
| 116       | `InalambriaErrorFlow`                            | Inalambria respondio: {responseCode} \| {body}                                 |
| 500       | (BRE-B flows)                                    | Visionamos Auth Error / Visionamos Request Error                               |
| (dynamic) | `SendToCoreRspErrorFlow`                         | Core banking returned non-zero response code with description                  |

---

## 6. Validation Reference

Request validation is performed by `ValJsonRequestFlow` using rules from `Data/FieldsFormatRules.json`.

### Validation Ranges

| Range Name                | Rule                                             |
| ------------------------- | ------------------------------------------------ |
| `DocumentNumberRangeList` | Numeric, 0 to 9999999999999999 (up to 16 digits) |
| `OtpRangeList`            | Numeric, 0 to 999999 (6 digits)                  |
| `PasswordRangeList`       | String, max 60 chars (BCrypt hash)               |
| `HashRangeList`           | String, max 29 chars (BCrypt salt)               |
| `ValoresRangeList`        | Numeric range for monetary values                |
| `IdCuentaRangeList`       | Numeric range for account IDs                    |
| `AccountNumberRangeList`  | Numeric range for account numbers                |
| `EntityCodeRangeList`     | Numeric range for entity codes                   |
| `MobileRangeList`         | Numeric range for mobile numbers                 |
| `NamesRangeList`          | String range for names                           |
| `EmailRangeList`          | String range for email                           |
| `LongStringRangeList`     | String range for long text fields                |
| `FechaRangeList`          | Numeric range for dates (yyyyMMdd format)        |
| `TrnTypeOtpList`          | Numeric range for transaction types              |
| `PositiveAmountRange`     | Numeric, positive amounts                        |
| `TypeAccountRange`        | Numeric range for account types                  |
| `TargetNodeRange`         | Numeric range for target nodes                   |

### Allowed Lists

| List Name                   | Rule                                               |
| --------------------------- | -------------------------------------------------- |
| `DocTypeList`               | Allowed document types (e.g., CC, CE, NIT, TI, PA) |
| `CreditTypeList`            | Allowed credit/portfolio types                     |
| `AccountTypeVisionamosList` | Allowed Visionamos account types                   |
| `TypeKeyList`               | Allowed BRE-B key types                            |

---

## 7. Observations

### Architecture

- **Single POST entry point:** All 49 endpoints share a single HTTP POST listener, routed by URL path via `PathMap`. No REST verbs are used for incoming requests.
- **Flow reuse:** Several paths map to the same internal flow (e.g., `/transfer/external/sources/savings`, `/payment/internal/sources/savings` both use `TransferInternalSourcesSavingsFlow`).
- **Core banking integration:** Uses ODBC stored procedure (`SpAppMovil`) with fixed-length frame protocol. Responses are parsed using MapFrame JSON definitions.
- **Third-party integrations:** Visionamos (external transfers, BRE-B), TransfiYa (real-time transfers via Visionamos), Payzen (payment links), Inalambria (SMS).

### Security Concerns

- **Hardcoded OTP bypass:** Document number `93370888` skips OTP validation in the login flow (line 2536). This should be removed in production.
- **Password handling:** BCrypt hash + HMAC-SHA256 pepper. Salt is stored and retrievable via `/get-salt` endpoint.
- **JWT lifetime:** Token expiration is configured but the exact TTL is not visible in the static config.

### Data Quirks

- **`indPag` field:** Present as a required field in many query endpoints but its purpose as a pagination indicator is not fully clear from the flow logic.
- **`ike` typo:** In `/bre-b/keys/resolve`, `DefaultFields.json` lists `ike` as a required field -- likely a typo.
- **Decimal values:** Core banking monetary fields use `ValorConDecimales` type where the last 2 digits represent decimals (e.g., `150000` = `1500.00`). The API converts these before returning.
- **Masked contact info:** `/send-otp` and `/send-otp/transaction` return masked phone (`********XX`) and email (`****@domain`).
- **Empty results:** Endpoints that query lists return `{"statusCode":0,"payload":[]}` when no results are found (not an error).

### BRE-B Endpoints

- All BRE-B endpoints proxy requests to Visionamos BRE-B API after JWT authentication.
- They authenticate with Visionamos using a separate OAuth token flow before making the actual API call.
- Error responses from BRE-B flows use `statusCode: 500` with `"Visionamos Auth Error"` or `"Visionamos Request Error"` and include the upstream error details in the payload.
