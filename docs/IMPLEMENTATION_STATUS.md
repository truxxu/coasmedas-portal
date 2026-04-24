# API Implementation Status

> Track progress of endpoint implementation in the Next.js web portal.
> Generated: 2026-02-05

## Legend

- ✅ Used in mobile (priority for web implementation)
- Auth: None / JWT / JWT + OTP

---

## 1. Authentication

- [x] POST `/get-salt` ✅ Auth: None
- [x] POST `/send-otp` ✅ Auth: None
- [x] POST `/login` ✅ Auth: None
- [x] POST `/send-otp/transaction` ✅ Auth: None

## 2. Registration

- [x] POST `/userValidation` ✅ Auth: None
- [x] POST `/register` ✅ Auth: None

## 3. Password Management

- [x] POST `/update-password` ✅ Auth: None

## 4. Account & Products

- [x] POST `/balances` ✅ Auth: JWT
- [x] POST `/movements` ✅ Auth: JWT
- [x] POST `/products/savings` ✅ Auth: JWT
- [x] POST `/products/credits` ✅ Auth: JWT
- [x] POST `/products/investments` ✅ Auth: JWT
- [x] POST `/products/contributions` ✅ Auth: JWT
- [x] POST `/products/protection` ✅ Auth: JWT
- [x] POST `/products/pockets` ✅ Auth: JWT

## 5. Payments

- [x] POST `/payment/products` ✅ Auth: JWT
- [x] POST `/payment/unified` ✅ Auth: JWT
- [x] POST `/payment/internal/sources/savings` ✅ Auth: JWT
- [x] POST `/payment/internal/sources/credits` ✅ Auth: JWT
- [x] POST `/payment/internal/createTransaction` ✅ Auth: JWT + OTP
- [x] POST `/payment/payzen/createTransaction` ✅ Auth: JWT

## 6. Internal Transfers

- [x] POST `/transfer/internal/sources/savings` ✅ Auth: JWT
- [x] POST `/transfer/internal/sources/credits` ✅ Auth: JWT
- [x] POST `/transfer/internal/sources/investments` ✅ Auth: JWT
- [x] POST `/transfer/internal/targets/savings` ✅ Auth: JWT
- [x] POST `/transfer/internal/targets/credits` ✅ Auth: JWT
- [x] POST `/transfer/internal/targets/investments` ✅ Auth: JWT
- [x] POST `/transfer/internal/createTransaction` ✅ Auth: JWT + OTP

## 7. External Transfers (Banks - Visionamos)

- [x] POST `/transfer/external/sources/savings` ✅ Auth: JWT
- [x] POST `/transfer/external/sources/credits` ✅ Auth: JWT
- [x] POST `/transfer/external/listBanks` ✅ Auth: JWT
- [x] POST `/transfer/external/getTransactionCost` ✅ Auth: JWT
- [x] POST `/transfer/external/banks/createTransaction` ✅ Auth: JWT + OTP

## 8. External Transfers (Coopcentral Entities)

- [x] POST `/transfer/external/listEntities` ✅ Auth: JWT
- [x] POST `/transfer/external/entities/targets/queryProduct` ✅ Auth: JWT
- [x] POST `/transfer/external/entities/createTransaction` ✅ Auth: JWT + OTP

## 9. BRE-B (Key-Based Instant Transfers)

- [ ] POST `/bre-b/accounts/list` ✅ Auth: JWT
- [ ] POST `/bre-b/keys/list` ✅ Auth: JWT
- [ ] POST `/bre-b/keys/resolve` ✅ Auth: JWT
- [ ] POST `/bre-b/keys/create` ✅ Auth: JWT
- [ ] POST `/bre-b/keys/update` ✅ Auth: JWT
- [ ] POST `/bre-b/keys/delete` ✅ Auth: JWT
- [ ] POST `/bre-b/keys/block` ✅ Auth: JWT
- [ ] POST `/bre-b/keys/unblock` ✅ Auth: JWT
- [ ] POST `/bre-b/terms/accept` ✅ Auth: JWT
- [ ] POST `/bre-b/txs/init` ✅ Auth: JWT
- [ ] POST `/bre-b/txs/status` ✅ Auth: JWT
- [ ] POST `/bre-b/txs/list` ✅ Auth: JWT

## 10. Endpoints Not in Backend (UI Features Without API)

> See [`docs/ui-features-without-api.md`](./ui-features-without-api.md) for full report.

These endpoints are **needed by the portal UI** but do **not exist** in the backend API documentation.

### High Priority (blocking UI features)

- [ ] `POST /reports/download` - Descarga de extractos mensuales (5 product pages)
- [ ] `POST /utilities/companies` - Listar empresas de servicios públicos
- [ ] `POST /utilities/register` - Inscribir servicio público
- [ ] `POST /utilities/debt` - Consultar deuda de servicio
- [ ] `POST /utilities/list` - Listar servicios inscritos
- [ ] `POST /utilities/pay` - Ejecutar pago de servicio público
- [ ] `POST /utilities/delete` - Eliminar servicio inscrito
- [ ] `POST /beneficiaries/list` - Listar beneficiarios registrados
- [ ] `POST /beneficiaries/search` - Buscar asociados por nombre/documento
- [ ] `POST /beneficiaries/register` - Inscribir nuevo beneficiario
- [ ] `POST /beneficiaries/delete` - Eliminar beneficiario
- [ ] `POST /accounts/inscribed/register` - Inscribir cuenta externa
- [ ] `POST /accounts/inscribed/list` - Listar cuentas inscritas
- [ ] `POST /accounts/inscribed/update` - Editar cuenta inscrita
- [ ] `POST /accounts/inscribed/delete` - Eliminar cuenta inscrita

### Medium Priority

- [ ] `POST /transactions/receipt` - Descarga de comprobante de transacción
- [ ] `POST /user/profile` - Consultar perfil completo del usuario
- [ ] `POST /user/update` - Actualizar datos de perfil
- [ ] `POST /refresh-token` - Renovar sesión sin re-auth
- [ ] `POST /payment/pse/status` - Consultar estado de transacción PSE

**Note**: Los nombres de endpoint son propuestas. Los endpoints reales deben ser definidos por el equipo backend.

---

## Summary

| Domain                        | Total  | Implemented | Remaining |
| ----------------------------- | ------ | ----------- | --------- |
| Authentication                | 4      | 4           | 0         |
| Registration                  | 2      | 2           | 0         |
| Password                      | 1      | 1           | 0         |
| Products                      | 7      | 7           | 0         |
| Payments                      | 5      | 5           | 0         |
| Internal Transfers            | 7      | 7           | 0         |
| External Transfers (Banks)    | 5      | 5           | 0         |
| External Transfers (Entities) | 3      | 3           | 0         |
| BRE-B                         | 12     | 0           | 12        |
| **Subtotal (existing API)**   | **46** | **34**      | **12**    |

### Missing from Backend API

| Domain                   | Endpoints Needed | Priority |
| ------------------------ | ---------------- | -------- |
| Reportes/Extractos       | 1                | Alta     |
| Servicios Públicos       | 6                | Alta     |
| Beneficiarios            | 4                | Alta     |
| Cuentas Inscritas (CRUD) | 4                | Alta     |
| Comprobantes             | 1                | Media    |
| Perfil de Usuario        | 2                | Media    |
| Sesión (Refresh Token)   | 1                | Media    |
| Estado PSE               | 1                | Media    |
| **Total sin API**        | **20**           | -        |
