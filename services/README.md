# API Services Layer

## Architecture Overview

All HTTP communication with the Coasmedas backend uses **Axios** with a centralized configuration.

### Key Constraints

- **All endpoints use POST** (even data retrieval)
- **Response envelope**: `{ statusCode, statusDesc, payload }`
- **Auth**: JWT Bearer token (RS256), no refresh mechanism
- **OTP**: 6-digit SMS codes for login and transactions

### Clients

| Client      | File                        | Use Case                                   |
| ----------- | --------------------------- | ------------------------------------------ |
| Client-side | `/lib/api/client.ts`        | Browser requests (React components, hooks) |
| Server-side | `/lib/api/server-client.ts` | Server Components, Server Actions          |

### Auth Token Flow

1. **Login**: Server Action calls `/login`, stores JWT in HttpOnly cookie
2. **Client requests**: Token read from memory (set via `setTokenGetter`)
3. **Server requests**: Token read from cookie via `next/headers`
4. **Logout**: Cookie cleared via Server Action

## Adding New Endpoint Implementation

1. Add types to `/types/api/[domain].ts`
2. Implement service function in `/services/[domain].service.ts`
3. Follow patterns in `/services/_template.ts`
4. Update implementation status in `/docs/IMPLEMENTATION_STATUS.md`

### Example

```typescript
// 1. types/api/products.ts
export interface SavingsProduct {
  numeroCuenta: string;
  saldoDisponible: string | number;
  // ...
}

// 2. services/products.service.ts
import { apiPost } from "@/lib/api/client";
import type { SavingsProduct } from "@/types/api/products";
import type { UserIdentification } from "@/types/api/common";

export async function getSavingsProducts(
  params: UserIdentification,
): Promise<SavingsProduct[]> {
  return apiPost<SavingsProduct[]>("/products/savings", params);
}
```

## Error Handling

All service functions may throw:

| Error Class       | Status Code | Description                        |
| ----------------- | ----------- | ---------------------------------- |
| `AuthError`       | 107         | Session expired, redirect to login |
| `ValidationError` | 2           | Invalid request data               |
| `ApiError`        | Various     | Other backend errors               |
| `NetworkError`    | N/A         | Connection failures                |

Error classes are defined in `/lib/api/errors.ts`.

## Conventions

- Service functions return unwrapped `payload` (not AxiosResponse or envelope)
- All functions are async and properly typed
- JSDoc includes `@endpoint`, `@auth`, and `@status` tags
- Monetary values may arrive as string or number - use `normalizeMoney()` from `types/api/common.ts`
- Server Actions wrap service calls in try/catch and return `{ success, data?, error? }`
