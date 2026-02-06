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

## 5. Payments

- [ ] POST `/payment/products` ✅ Auth: JWT
- [ ] POST `/payment/internal/sources/savings` ✅ Auth: JWT
- [ ] POST `/payment/internal/sources/credits` ✅ Auth: JWT
- [ ] POST `/payment/internal/createTransaction` ✅ Auth: JWT + OTP
- [ ] POST `/payment/payzen/createTransaction` ✅ Auth: JWT

## 6. Internal Transfers

- [ ] POST `/transfer/internal/sources/savings` ✅ Auth: JWT
- [ ] POST `/transfer/internal/sources/credits` ✅ Auth: JWT
- [ ] POST `/transfer/internal/sources/investments` ✅ Auth: JWT
- [ ] POST `/transfer/internal/targets/savings` ✅ Auth: JWT
- [ ] POST `/transfer/internal/targets/credits` ✅ Auth: JWT
- [ ] POST `/transfer/internal/targets/investments` ✅ Auth: JWT
- [ ] POST `/transfer/internal/createTransaction` ✅ Auth: JWT + OTP

## 7. External Transfers (Banks - Visionamos)

- [ ] POST `/transfer/external/sources/savings` ✅ Auth: JWT
- [ ] POST `/transfer/external/sources/credits` ✅ Auth: JWT
- [ ] POST `/transfer/external/listBanks` ✅ Auth: JWT
- [ ] POST `/transfer/external/getTransactionCost` ✅ Auth: JWT
- [ ] POST `/transfer/external/banks/createTransaction` ✅ Auth: JWT + OTP

## 8. External Transfers (Coopcentral Entities)

- [ ] POST `/transfer/external/listEntities` ✅ Auth: JWT
- [ ] POST `/transfer/external/entities/targets/queryProduct` ✅ Auth: JWT
- [ ] POST `/transfer/external/entities/createTransaction` ✅ Auth: JWT + OTP

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

---

## Summary

| Domain | Total | Implemented | Remaining |
|--------|-------|-------------|-----------|
| Authentication | 4 | 4 | 0 |
| Registration | 2 | 2 | 0 |
| Password | 1 | 1 | 0 |
| Products | 7 | 7 | 0 |
| Payments | 5 | 0 | 5 |
| Internal Transfers | 7 | 0 | 7 |
| External Transfers (Banks) | 5 | 0 | 5 |
| External Transfers (Entities) | 3 | 0 | 3 |
| BRE-B | 12 | 0 | 12 |
| **Total** | **46** | **14** | **32** |
