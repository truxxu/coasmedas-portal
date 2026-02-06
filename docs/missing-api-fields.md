# Missing API Fields Strategy

Documents how UI fields that have no direct API equivalent are handled in the product mappers (`src/utils/productMappers.ts`).

## Savings (SavingsProduct)

| UI Field | Strategy | Value |
|----------|----------|-------|
| `status` | Default | `'activo'` — API has no status field for savings accounts |

## Credits / Obligaciones (ObligacionProduct)

| UI Field | Strategy | Value |
|----------|----------|-------|
| `disbursedAmount` | Best proxy | Uses `pagoTotal` — API does not expose the original disbursed amount |

## Investments / Inversiones (InversionProduct)

| UI Field | Strategy | Value |
|----------|----------|-------|
| `creationDate` | Empty string | `''` — API does not return creation date |
| `status` | Derived | `fechaVencimiento < today` → `'vencido'`, else `'activo'` |
| `productPrefix` | Derived | `codigoProductoCobis === '4'` → `'PAC-'`, else `'DTA-'` |

## Contributions / Aportes (AportesProduct)

| UI Field | Strategy | Value |
|----------|----------|-------|
| `planName` | Hardcoded | `'Plan de Aportes'` — API does not return a plan name |
| `paymentDeadline` | Mapped | Uses `fechaCubrimientoAportes` from the aportes detail |

## Protection / Proteccion (ProteccionProduct)

| UI Field | Strategy | Value |
|----------|----------|-------|
| `status` | Derived | `diasMora > 0` → `'inactivo'`, else `'activo'` |
| `annualPayment` | Best proxy | Uses `pagoTotal` — API does not distinguish annual vs total payment |

## Notes

- These defaults should be revisited once backend confirms whether new fields can be exposed.
- See `docs/api-gaps.md` for broader API discrepancies.
- Mapper source: `src/utils/productMappers.ts`.
