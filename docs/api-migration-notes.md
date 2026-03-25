# API Migration Notes - Mobile to Web Portal

> **Generated:** 2026-02-05
> **Purpose:** Recommendations for implementing the API in the Next.js web portal based on mobile app patterns and available endpoints

---

## 1. Implementation Priority

### Phase 1: Core (Already implemented in portal)

These endpoints support features already built in the web portal:

| Endpoint                                           | Web Feature                        | Portal Route                                 |
| -------------------------------------------------- | ---------------------------------- | -------------------------------------------- |
| `/login`                                           | Authentication                     | `/login`                                     |
| `/get-salt`                                        | Login flow                         | `/login`                                     |
| `/send-otp`                                        | Login OTP                          | `/login`                                     |
| `/balances`                                        | Dashboard                          | `/home`                                      |
| `/products/contributions`                          | Aportes page                       | `/productos/aportes`                         |
| `/products/savings`                                | Ahorros page                       | `/productos/ahorros`                         |
| `/products/credits`                                | Obligaciones page                  | `/productos/obligaciones`                    |
| `/products/investments`                            | Inversiones page                   | `/productos/inversiones`                     |
| `/products/protection`                             | Proteccion page                    | `/productos/proteccion`                      |
| `/movements`                                       | Transaction history (all products) | `/productos/*`                               |
| `/payment/products`                                | Payment selection                  | `/pagos/pagar-mis-productos`                 |
| `/payment/internal/sources/savings`                | Payment source                     | `/pagos/*/`                                  |
| `/payment/internal/sources/credits`                | Payment source                     | `/pagos/*/`                                  |
| `/payment/internal/createTransaction`              | Execute payment                    | `/pagos/*/`                                  |
| `/payment/payzen/createTransaction`                | PSE payment                        | `/pagos/*/`                                  |
| `/send-otp/transaction`                            | Transaction OTP                    | `/pagos/*, /transferencias/*`                |
| `/transfer/internal/sources/savings`               | Transfer source                    | `/transferencias/internas/entre-mis-cuentas` |
| `/transfer/internal/sources/credits`               | Transfer source                    | `/transferencias/internas/entre-mis-cuentas` |
| `/transfer/internal/sources/investments`           | Transfer source                    | `/transferencias/internas/entre-mis-cuentas` |
| `/transfer/internal/targets/savings`               | Transfer destination               | `/transferencias/internas/entre-mis-cuentas` |
| `/transfer/internal/targets/credits`               | Transfer destination               | `/transferencias/internas/entre-mis-cuentas` |
| `/transfer/internal/targets/investments`           | Transfer destination               | `/transferencias/internas/entre-mis-cuentas` |
| `/transfer/internal/createTransaction`             | Execute transfer                   | `/transferencias/internas/entre-mis-cuentas` |
| `/transfer/external/listEntities`                  | Entity list                        | `/transferencias/internas/cuentas-mi-red`    |
| `/transfer/external/entities/targets/queryProduct` | Validate destination               | `/transferencias/internas/cuentas-mi-red`    |
| `/transfer/external/entities/createTransaction`    | Execute entity transfer            | `/transferencias/internas/cuentas-mi-red`    |

### Phase 2: Registration & Account Management

| Endpoint           | Web Feature       | Notes                   |
| ------------------ | ----------------- | ----------------------- |
| `/userValidation`  | User registration | Not yet built in portal |
| `/register`        | User registration | Not yet built in portal |
| `/update-password` | Password change   | Not yet built in portal |

### Phase 3: External Transfers & BRE-B

| Endpoint                                     | Web Feature            | Notes                       |
| -------------------------------------------- | ---------------------- | --------------------------- |
| `/transfer/external/listBanks`               | Bank transfers         | Not in current portal scope |
| `/transfer/external/sources/*`               | Bank transfer source   | Not in current portal scope |
| `/transfer/external/getTransactionCost`      | Transfer cost          | Not in current portal scope |
| `/transfer/external/banks/createTransaction` | Execute bank transfer  | Not in current portal scope |
| `/bre-b/*` (12 endpoints)                    | BRE-B keys & transfers | Not in current portal scope |

---

## 2. Web-Specific Implementation Differences

### 2.1 Authentication Flow

**Mobile approach:** BCrypt hashing on device → send hash to server
**Web approach:** Same pattern, but need a JavaScript BCrypt library

```
Required: bcryptjs (or similar) npm package
Flow:
1. GET salt via /get-salt
2. Hash password with salt using bcryptjs
3. Send hash + OTP to /login
4. Store JWT in memory (not localStorage for security)
```

**Recommendation:** Use `bcryptjs` package. Add to `package.json` dependencies. Password hashing must happen client-side since the server expects the BCrypt hash.

### 2.2 Token Management

**Mobile:** Token in React Context (in-memory only)
**Web recommendation:**

- Store JWT in memory (React Context/state) - same as mobile
- Do NOT persist to localStorage/cookies (token contains sensitive claims)
- Handle 107 (unauthorized) by redirecting to login
- No token refresh mechanism exists - session ends on expiry

### 2.3 Device Identification (BRE-B only)

BRE-B endpoints require device info. For web:

- `platform`: Use `"web"`
- `userAgentString`: Use `navigator.userAgent`
- `trademark`/`model`: Not available, use `"web"` or `"unknown"`
- `ip`: Use a public IP lookup service or let server detect

### 2.4 OTP Delivery

**Mobile:** SMS code input with numeric keyboard
**Web:**

- Same 6-digit code input
- Already implemented via `CodeInputCard` + `CodeInputGroup` components
- `/send-otp` response includes `email` field - consider showing both channels

### 2.5 Payzen/PSE Payment Redirect

**Mobile:** Opens WebView to Payzen URL
**Web:**

- Redirect to `paymentUrl` in a new tab or same window
- Need a callback/return URL mechanism
- Currently implemented as `PSELoadingCard` component
- Verify if Payzen supports web redirect callbacks

---

## 3. API Client Architecture Recommendations

### 3.1 Centralized API Service

Create a single API service layer (e.g., `src/services/api.ts`) that:

- Sets base URL from environment
- Adds `Authorization: Bearer` header when token is available
- Always uses POST method
- Sets `Content-Type: application/json`
- Handles the standard response envelope
- Handles error code 107 (redirect to login)
- Has a 30-second timeout (matching mobile)

```typescript
// Recommended structure
interface ApiResponse<T> {
  statusCode: number;
  statusDesc: string;
  payload?: T;
}

async function apiCall<T>(
  endpoint: string,
  body: object,
): Promise<ApiResponse<T>> {
  // Centralized POST with auth header, error handling, timeout
}
```

### 3.2 Error Handling

Map API error codes to user-friendly Spanish messages:

```typescript
const errorMessages: Record<number, string> = {
  1: "Error en el inicio de sesion",
  2: "Los datos ingresados no son validos",
  101: "Usuario no encontrado",
  106: "Codigo OTP invalido",
  107: "Sesion expirada. Por favor inicie sesion nuevamente",
  // ... etc
};
```

### 3.3 Type Safety

Define TypeScript interfaces matching the actual API responses. Handle the string/number ambiguity:

```typescript
// Use string | number for fields that may come as either
interface SavingsProduct {
  numeroCuenta: string;
  alias: string;
  nombreProducto: string;
  saldoDisponible: string | number;
  saldoTotal: string | number;
  idCuenta: string;
  codigoProductoCobis: string | number;
}

// Normalize on receipt
function normalizeMoney(value: string | number): number {
  return typeof value === "string" ? parseFloat(value) : value;
}
```

---

## 4. Endpoints Needing Different Web Handling

### 4.1 `/balances` - Response interpretation

The `/balances` endpoint response structure is unclear between sources. Options:

1. **If flat array:** Parse `producto` field to categorize into product types
2. **If categorized object:** Use directly

**Recommendation:** Test with live API first. Build a normalization layer that handles both formats.

### 4.2 `/payment/payzen/createTransaction` - PSE redirect

Mobile opens WebView. Web needs:

- Window redirect or popup to `paymentUrl`
- Return URL handling (polling or callback)
- Consider using `window.open()` for the payment and polling `/bre-b/txs/status` or similar

### 4.3 BRE-B - Device info

BRE-B endpoints require device info that's naturally available on mobile but not web:

- `platform`: Send `"web"` instead of `"ios"/"android"`
- `trademark`/`model`: Send browser name/version
- `ip`: Use server-side detection or public API
- Verify backend accepts `"web"` as a valid platform value

---

## 5. Unused Endpoints Worth Considering for Web

| Endpoint                                     | Potential Web Use                                 |
| -------------------------------------------- | ------------------------------------------------- |
| `/transfer/external/listBanks`               | External bank transfers (future feature)          |
| `/transfer/external/banks/createTransaction` | External bank transfers (future feature)          |
| `/bre-b/*`                                   | BRE-B instant transfers (future feature, complex) |

---

## 6. Known Limitations

1. **No token refresh** - JWT expires and user must log in again. Consider implementing a session timeout warning in the web portal.
2. **All POST** - Cannot leverage HTTP caching for GET requests. Implement client-side caching if needed (e.g., React Query/SWR stale-while-revalidate).
3. **No WebSocket/SSE** - All communication is request/response. BRE-B transaction status requires polling.
4. **No file upload endpoints** - No document/receipt upload capability in the current API.
5. **No user profile update** - Cannot update email, phone, address via API.
6. **No notification endpoints** - No push/pull notification system.
7. **CORS** - Backend sets `Access-Control-Allow-Origin: *`. Should work for web, but verify in production.

---

## 7. Environment Configuration

### Next.js Environment Variables

```env
# .env.development
NEXT_PUBLIC_API_BASE_URL=https://intepruapp.coasmedas.coop
NEXT_PUBLIC_INACTIVITY_TIMEOUT=3600

# .env.production
NEXT_PUBLIC_API_BASE_URL=https://inteprodapp.coasmedas.coop
NEXT_PUBLIC_INACTIVITY_TIMEOUT=60
```

### API Proxy Consideration

For security (hiding API base URL from client), consider proxying through Next.js API routes:

```
Client → /api/proxy/login → Backend /login
```

This also solves potential CORS issues and allows server-side token management.
