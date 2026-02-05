# API Gaps & Discrepancies Report

> **Generated:** 2026-02-05
> **Purpose:** Track endpoints and data structures that need clarification or live testing before web portal implementation

---

## 1. Coverage Matrix

### Endpoints in ALL THREE sources (18 endpoints)

Fully documented with Postman examples. Highest confidence.

| # | Endpoint | Domain |
|---|----------|--------|
| 1 | `/get-salt` | Auth |
| 2 | `/send-otp` | Auth |
| 3 | `/login` | Auth |
| 4 | `/balances` | Account |
| 5 | `/movements` | Account |
| 6 | `/transfer/external/listEntities` | External Transfers |
| 7 | `/bre-b/accounts/list` | BRE-B |
| 8 | `/bre-b/keys/create` | BRE-B |
| 9 | `/bre-b/keys/delete` | BRE-B |
| 10 | `/bre-b/keys/update` | BRE-B |
| 11 | `/bre-b/keys/block` | BRE-B |
| 12 | `/bre-b/keys/list` | BRE-B |
| 13 | `/bre-b/keys/resolve` | BRE-B |
| 14 | `/bre-b/keys/unblock` | BRE-B |
| 15 | `/bre-b/txs/init` | BRE-B |
| 16 | `/bre-b/txs/status` | BRE-B |
| 17 | `/bre-b/txs/list` | BRE-B |
| 18 | `/bre-b/terms/accept` | BRE-B |

### Endpoints in Backend + Mobile but NOT in Postman (30 endpoints)

Documented but lack real request/response examples. Medium confidence.

| # | Endpoint | Domain |
|---|----------|--------|
| 1 | `/register` | Registration |
| 2 | `/userValidation` | Registration |
| 3 | `/update-password` | Password |
| 4 | `/send-otp/transaction` | Transaction OTP |
| 5 | `/payment/products` | Payments |
| 6 | `/payment/internal/sources/savings` | Payments |
| 7 | `/payment/internal/sources/credits` | Payments |
| 8 | `/payment/internal/createTransaction` | Payments |
| 9 | `/payment/payzen/createTransaction` | Payments |
| 10 | `/transfer/internal/sources/savings` | Internal Transfers |
| 11 | `/transfer/internal/sources/credits` | Internal Transfers |
| 12 | `/transfer/internal/sources/investments` | Internal Transfers |
| 13 | `/transfer/internal/targets/savings` | Internal Transfers |
| 14 | `/transfer/internal/targets/credits` | Internal Transfers |
| 15 | `/transfer/internal/targets/investments` | Internal Transfers |
| 16 | `/transfer/internal/createTransaction` | Internal Transfers |
| 17 | `/transfer/external/sources/savings` | External Transfers |
| 18 | `/transfer/external/sources/credits` | External Transfers |
| 19 | `/transfer/external/listBanks` | External Transfers |
| 20 | `/transfer/external/getTransactionCost` | External Transfers |
| 21 | `/transfer/external/banks/createTransaction` | External Transfers |
| 22 | `/transfer/external/entities/targets/queryProduct` | External Transfers |
| 23 | `/transfer/external/entities/createTransaction` | External Transfers |
| 24 | `/transfer/external/transfiya/getTransactionCost` | TransfiYa |
| 25 | `/transfer/external/transfiya/createTransaction` | TransfiYa |
| 26 | `/products/savings` | Products |
| 27 | `/products/credits` | Products |
| 28 | `/products/investments` | Products |
| 29 | `/products/contributions` | Products |
| 30 | `/products/protection` | Products |

### Endpoints in Backend + Postman but NOT in Mobile audit (1 endpoint)

| # | Endpoint | Domain | Notes |
|---|----------|--------|-------|
| 1 | `/register-device` | Registration | New feature for trusted device management |

---

## 2. Authentication Discrepancies

These endpoints have conflicting auth requirements between sources. **Must verify with backend team.**

| Endpoint | Mobile Says | Backend Says | Likely Correct |
|----------|-------------|--------------|----------------|
| `/get-salt` | No auth | JWT | **No auth** (used pre-login, Postman confirms) |
| `/send-otp/transaction` | No auth | JWT | **JWT** (used post-login for transactions) |
| `/userValidation` | No auth | JWT | **No auth** (used pre-registration) |

**Action:** Confirm with backend team. The mobile app may be making calls without auth that the backend doesn't enforce strictly (e.g., JWT validation only checks if header is present, not if the endpoint truly requires it).

---

## 3. Request Payload Discrepancies

### 3.1 `indPag` field inconsistency

**Issue:** Many endpoints have `indPag` in backend docs but not in mobile app code.

| Endpoint | Mobile | Backend | Postman |
|----------|--------|---------|---------|
| `/get-salt` | Not sent | `indPag: "1"` | Not sent |
| `/send-otp` | Not sent | `indPag: "1"` | Not sent |
| `/balances` | Not sent | `indPag: "1"` | Not sent |
| `/products/*` | Not sent | `indPag: "1"` | N/A |
| `/bre-b/accounts/list` | `indPag: "0"` | `indPag: "1"` | `indPag: "0"` |

**Action:** Test whether `indPag` is truly required or silently ignored. The mobile app works without it for most endpoints. **For web: omit unless pagination is needed.**

### 3.2 `/send-otp` - `deviceId` field

- **Mobile report:** Not documented
- **Backend docs:** Not documented
- **Postman:** Sends `deviceId: "23234"`
- **Impact:** Enables `isTrustedDevice` response field

**Action:** Implement `deviceId` for web portal to support trusted device flow. Generate/persist a device identifier (e.g., localStorage UUID).

### 3.3 `/login` - `deviceId` field

- **Mobile report:** Not sent
- **Backend docs:** Includes `deviceId`
- **Postman:** Not sent

**Action:** Test whether login works without `deviceId`. If trusted device flow is implemented, send it.

### 3.4 `/payment/internal/createTransaction` - `cuentas` array

- **Mobile:** Sends `cuentas` array (supports multi-product unified payment)
- **Backend:** Does not document `cuentas` field

**Action:** The `cuentas` array is needed for unified payment. Include it. Verify field structure matches mobile implementation.

### 3.5 TransfiYa `deviceFingerPrint` field mismatch

| Field | Mobile | Backend |
|-------|--------|---------|
| `hash` | :white_check_mark: | :white_check_mark: |
| `ipAddress` | :white_check_mark: | :white_check_mark: |
| `country` | :white_check_mark: | :white_check_mark: |
| `city` | :white_check_mark: | :white_check_mark: |
| `mobileDevice` | :white_check_mark: | :white_check_mark: |
| `operator` | :white_check_mark: | :white_check_mark: |
| `geolocation` | :x: | :white_check_mark: |
| `SIMCardId` | :x: | :white_check_mark: |
| `model` | :x: | :white_check_mark: |

**Action:** Send all fields per backend spec. For web: `SIMCardId` and `operator` won't be available. Set to `"unknown"` or `"web"`. `geolocation` can use browser Geolocation API.

---

## 4. Response Structure Discrepancies

### 4.1 `/balances` - Major structure conflict

- **Mobile:** Reports categorized object: `{ ahorro: [...], aportes: [...], inversion: [...], credito: [...], proteccion: [...] }`
- **Backend:** Shows flat array: `[{ producto: "AHORROS", saldo: "150000" }]`

**Action:** **CRITICAL - must test with live API.** The mobile may have an intermediate transformation layer, or the backend may have been updated since the docs were written.

### 4.2 String vs Number types in responses

| Field | Backend Says | Mobile Says | Postman Shows |
|-------|-------------|-------------|---------------|
| `saldoDisponible` | string | number | N/A |
| `saldoTotal` | string | number | N/A |
| `codigoProductoCobis` | string | number | **number** (in BRE-B accounts) |
| `documentNumber` (login) | number | N/A | **number** (79138052) |
| `mobile` (login) | number | N/A | **number** (3006747173) |
| `pagoMinimo` | string | number | N/A |

**Action:** Backend docs say string (MapFrame parsing). Actual API likely returns mixed types. **Code defensively - accept both string and number, normalize on receipt.** Use `Number()` or `String()` conversions as needed.

### 4.3 `/bre-b/txs/list` - Date field types

- **Mobile:** Sends dates as strings `"YYYYMMDD"`
- **Backend:** Shows dates as numbers `20240101`

**Action:** Send as numbers per backend spec. Both likely work since JSON parsing is flexible.

---

## 5. Missing Postman Examples (Priority)

Endpoints that need Postman collection entries for testing:

### High Priority (needed for core web features)
1. `/products/savings` - Product listing
2. `/products/credits` - Product listing
3. `/products/investments` - Product listing
4. `/products/contributions` - Product listing
5. `/products/protection` - Product listing
6. `/payment/products` - Payment flow start
7. `/payment/internal/createTransaction` - Payment execution
8. `/transfer/internal/createTransaction` - Transfer execution
9. `/send-otp/transaction` - Transaction OTP

### Medium Priority
10. `/transfer/internal/sources/savings` - Transfer source (reuses savings flow)
11. `/transfer/internal/targets/savings` - Transfer destination
12. `/payment/payzen/createTransaction` - PSE payment link
13. `/transfer/external/listBanks` - Bank listing
14. `/transfer/external/getTransactionCost` - Transfer cost

### Lower Priority (less common flows)
15. `/register` - Registration
16. `/userValidation` - User validation
17. `/update-password` - Password update
18. All remaining external transfer endpoints

---

## 6. Backend Quirks to Note

1. **All requests are POST** - Even data retrieval uses POST method. Do not use GET.
2. **`indPag` field** - Appears in many backend request specs but its pagination behavior is unclear. Mobile works with and without it.
3. **`ike` typo** - In `/bre-b/keys/resolve`, backend config lists `ike` as a field. Likely a typo for `like` or should be removed.
4. **Decimal handling** - Core banking uses `ValorConDecimales` where last 2 digits are decimals (e.g., `150000` = `$1,500.00`). The API converts before returning to the client.
5. **Hardcoded OTP bypass** - Document number `93370888` skips OTP validation in login flow. Present in test/dev environments.
6. **Empty results** - List endpoints return `{ statusCode: 0, payload: [] }` for empty results. Not an error.
7. **U119 state code** - Dual meaning: "empty result" in some contexts, "already exists" in BRE-B key creation.
