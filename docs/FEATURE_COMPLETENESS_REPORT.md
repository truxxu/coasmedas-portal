# Reporte de Funcionalidades Completas — Portal Transaccional Coasmedas

**Fecha:** 2026-04-24
**Rama:** main
**Criterio de "completo":** módulo que consume endpoints reales del API (sin datos mockeados en la capa de datos) y no depende de endpoints pendientes de implementación en backend.

---

## 1. Resumen Ejecutivo

De los módulos auditados, **12 funcionalidades** pueden considerarse **completas** (datos reales + endpoints disponibles), **5 están parcialmente completas** (mezcla de datos reales y mocks o dependen de endpoints aún no implementados en backend), y **6 están totalmente mockeadas**.

> **Nota metodológica:** los archivos de `src/mocks/` que contienen únicamente la configuración de pasos del `Stepper` (p.ej. `TRANSFER_STEPS`, `EXTERNAL_TRANSFER_STEPS`, `RED_COOP_TRANSFER_STEPS`) se consideran constantes de UI, no datos de negocio. Su uso no descalifica a un módulo como "completo" siempre que toda la data transaccional provenga de servicios reales.

---

## 2. Funcionalidades COMPLETAS

Las siguientes funcionalidades están integradas de punta a punta con el API de Coasmedas y no consumen datos mockeados de negocio:

### 2.1 Autenticación

- **Login** (`/login`)
  - Servicios: `auth.service` → `getSalt`, `sendOtp`, `login`
  - Hash de contraseña con `bcryptjs` en cliente, JWT almacenado en cookie `auth-token`
  - Middleware de validación de sesión en `middleware.ts`

### 2.2 Dashboard

- **Home** (`/home`)
  - Servicios: `products.service` → `getBalances`, `getMovements`
  - Muestra saldos consolidados y movimientos recientes reales

### 2.3 Productos (6 módulos)

Todas las vistas de productos consumen datos reales vía `products.service`:

| Módulo       | Ruta                      | Endpoints principales                                                          |
| ------------ | ------------------------- | ------------------------------------------------------------------------------ |
| Aportes      | `/productos/aportes`      | `/products/contributions`, `/products/contributions/movements`                 |
| Ahorros      | `/productos/ahorros`      | `/products/savings`, `/products/savings/movements`                             |
| Obligaciones | `/productos/obligaciones` | `/products/credits`, `/movements`                                              |
| Inversiones  | `/productos/inversiones`  | `/products/investments`                                                        |
| Protección   | `/productos/proteccion`   | `/products/protection`                                                         |
| CoasPocket   | `/productos/coaspocket`   | `/products/pockets`, `/products/pockets/movements`, `/products/pockets/create` |

### 2.4 Pagos de Productos Propios

Flujos de pago completos (detalle → confirmación → verificación SMS/PSE → resultado):

| Flujo                | Ruta                                      |
| -------------------- | ----------------------------------------- |
| Pago de Aportes      | `/pagos/pagar-mis-productos/aportes`      |
| Pago de Obligaciones | `/pagos/pagar-mis-productos/obligaciones` |
| Pago de Protección   | `/pagos/pagar-mis-productos/proteccion`   |

Servicios: `payments.service` → `getPaymentProducts`, `getPaymentProtection`, `getPaymentSourcesSavings`, `getPaymentSourcesCredits`, `createPaymentTransaction`, `createPayzenTransaction`.

### 2.5 Transferencias Internas — Entre mis cuentas

- Ruta: `/transferencias/internas/entre-mis-cuentas`
- Servicios: `transfers.service` → `getTransferSourcesSavings`, `getTransferTargetsSavings`, `createInternalTransfer`
- Verificación por OTP real vía `/send-otp/transaction`

### 2.6 Transferencias Externas — Otros Bancos

- Ruta: `/transferencias/externas/otros-bancos`
- Servicios: `getExternalSourcesSavings`, `listBanks`, `getTransactionCost`, `createExternalBankTransfer`

### 2.7 Transferencias Externas — Red Coopcentral

- Ruta: `/transferencias/externas/red-coopcentral`
- Servicios: `listEntities`, `queryEntityProduct`, `createExternalEntityTransfer`

### 2.8 Inscripción de Cuentas Externas

- Ruta: `/transferencias/inscribir-cuentas`
- Servicios: `listBanks`, `listEntities` (consulta de entidades y bancos reales para el formulario)

---

## 3. Funcionalidades PARCIALMENTE COMPLETAS

Estos módulos funcionan pero tienen dependencias mockeadas que requieren endpoints adicionales del backend para considerarse finalizados:

| Módulo                                       | Qué está real                            | Qué está mockeado / pendiente                                                   |
| -------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| **Pagos a Otros Asociados**                  | Flujo de confirmación, OTP y transacción | Listado de beneficiarios inscritos (CRUD de beneficiarios no existe en backend) |
| **Pagos Servicios Públicos**                 | Flujos SMS y confirmación                | Listado de servicios inscritos y catálogo de servicios (6 endpoints pendientes) |
| **Transferencias Internas — Cuentas Mi Red** | —                                        | Todos los datos provienen de `mockNetworkTransferData`                          |
| **Pago Unificado**                           | —                                        | Sin integración de servicios detectada                                          |
| **Inscripción de Servicios Públicos**        | —                                        | Depende de endpoints de utilities no implementados                              |

---

## 4. Funcionalidades TOTALMENTE MOCKEADAS

No deben considerarse completas. Usan datos de `src/mocks/` sin integración al API:

- Transferencias Internas — **Desde Cupos Rotativos**
- Transferencias Internas — **Recargar PSE**
- Transferencias Internas — **Programar Transferencias**
- **Tarjeta de Crédito** (Pagar, Avance, Bloqueo/Activación, Gestionar Clave) — los 12 endpoints BRE-B relacionados están marcados como TODO en `services/breb.service.ts`
- Gestión de beneficiarios y cuentas inscritas (listado/edición)
- Descarga de extractos mensuales (PDFs)

---

## 5. Estado del API Backend (Contexto)

Según `docs/IMPLEMENTATION_STATUS.md`:

- **34 de 46 endpoints implementados** en la capa `services/`
- **12 endpoints BRE-B** declarados como TODO (stub file `breb.service.ts`)
- **~20 endpoints adicionales** requeridos por la UI pero no existen en backend:
  - Extractos / reportes mensuales
  - Servicios públicos (catálogo, inscripción, CRUD)
  - CRUD de beneficiarios
  - CRUD de cuentas externas inscritas
  - Comprobantes de transacción
  - Perfil de usuario (CRUD)
  - Refresh de token JWT
  - Estado de pago PSE

---

## 6. Recomendación

Para una liberación a producción **limitada pero funcional**, los 12 módulos listados en la sección 2 son candidatos sólidos. Los módulos parcialmente mockeados (sección 3) requieren coordinación con el equipo de backend para definir endpoints faltantes antes de su liberación. Los módulos totalmente mockeados (sección 4) no deben ser expuestos a usuarios finales.

---

## Verificación

Para validar este reporte:

1. Revisar `docs/IMPLEMENTATION_STATUS.md` (estado canónico del equipo)
2. `grep -r "from \"@/src/mocks\"" app/` → confirma qué rutas aún importan mocks
3. `grep -r "from \"@/services" app/` → confirma qué rutas consumen servicios reales
4. Probar cada módulo de la sección 2 contra el entorno `intepruapp.coasmedas.coop` con credenciales de prueba
