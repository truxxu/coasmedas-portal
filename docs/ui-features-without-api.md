# Reporte de Funcionalidades UI Sin Soporte de API

> **Fecha**: 2026-03-03
> **Alcance**: Funcionalidades del portal que carecen de endpoint backend correspondiente

---

## Resumen Ejecutivo

Se identificaron **8 funcionalidades** presentes en la interfaz del portal que **no tienen endpoint API** en el backend documentado. Estas funcionalidades actualmente operan con datos mock, botones sin acción, o simplemente no pueden cumplir su propósito.

---

## 1. Descarga de Reportes / Extractos Mensuales

**Ubicación UI**: Componente `DownloadReportsCard` presente en las 5 páginas de productos:

- `app/(authenticated)/productos/aportes/page.tsx`
- `app/(authenticated)/productos/ahorros/page.tsx`
- `app/(authenticated)/productos/obligaciones/page.tsx`
- `app/(authenticated)/productos/inversiones/page.tsx`
- `app/(authenticated)/productos/proteccion/page.tsx`

**Qué muestra la UI**:

- Selector de mes para elegir período
- Botón "Descargar" para obtener reporte PDF del mes seleccionado
- Lista de meses disponibles (`mockAvailableMonths`)

**Endpoint necesario**: No existe ningún endpoint tipo `POST /reports/download` o `POST /statements/generate` en la documentación API.

**Impacto**: Los botones de descarga de extractos están visibles en todas las páginas de productos pero no pueden generar ni descargar ningún archivo. El usuario ve la funcionalidad pero no obtiene resultado.

**Componentes afectados**:

- `src/organisms/DownloadReportsCard.tsx`
- `src/mocks/` - `mockAvailableMonths`

---

## 2. Servicios Públicos - Inscripción y Pago

**Ubicación UI**: Flujo completo en dos rutas:

- `app/(authenticated)/pagos/servicios-publicos/inscribir/` (inscripción)
- `app/(authenticated)/pagos/servicios-publicos/pagar/` (pago)

**Qué muestra la UI**:

_Flujo de inscripción:_

- Formulario para registrar servicio público (electricidad, agua, gas, telefonía)
- Selección de empresa prestadora
- Ingreso de número de referencia/cuenta del servicio
- Pantalla de confirmación
- Pantalla de resultado

_Flujo de pago:_

- Lista de servicios inscritos
- Detalle del servicio a pagar con monto
- Selección de cuenta origen
- Confirmación con método de pago (PSE o cuenta)
- Verificación SMS / redirección PSE
- Pantalla de resultado

**Endpoints necesarios**: No existe ningún endpoint para:

- Listar empresas de servicios públicos
- Inscribir un servicio público
- Consultar deuda de un servicio
- Listar servicios inscritos del usuario
- Ejecutar pago de servicio público
- Eliminar servicio inscrito

**Impacto**: Todo el módulo de servicios públicos opera 100% con datos mock. No es posible ninguna operación real.

**Componentes afectados**:

- `src/organisms/FlowSelectionCard.tsx`
- `src/organisms/UtilityRegistrationForm.tsx`
- `src/organisms/UtilityConfirmationCard.tsx`
- `src/organisms/UtilityRegistrationResultCard.tsx`
- `src/organisms/UtilityPaymentDetailsForm.tsx`
- `src/organisms/UtilityPaymentConfirmationCard.tsx`
- `src/organisms/UtilityPaymentResultCard.tsx`
- `src/mocks/` - `mockUtilityRegistrationData`, `mockUtilityPaymentData`

---

## 3. Pagos a Otros Asociados - Gestión de Beneficiarios

**Ubicación UI**: Flujo completo en:

- `app/(authenticated)/pagos/otros-asociados/page.tsx` (selección de beneficiario)
- `app/(authenticated)/pagos/otros-asociados/pago/` (flujo de pago)

**Qué muestra la UI**:

- Lista de beneficiarios registrados (otros asociados de Coasmedas)
- Búsqueda de beneficiario por nombre o documento
- Selección de beneficiario para pagar
- Formulario de pago con monto y concepto
- Confirmación, verificación SMS/PSE, y resultado

**Endpoints necesarios**: No existe endpoint para:

- Listar beneficiarios registrados
- Buscar asociados por nombre/documento
- Inscribir un nuevo beneficiario
- Eliminar un beneficiario

**Nota**: El endpoint `POST /payment/internal/createTransaction` podría soportar parcialmente la ejecución del pago, pero la gestión de beneficiarios (CRUD) no tiene API.

**Impacto**: La lista de beneficiarios es datos mock. No se pueden buscar, agregar ni eliminar beneficiarios reales.

**Componentes afectados**:

- `src/organisms/BeneficiarySelectionCard.tsx`
- `src/molecules/BeneficiaryListItem.tsx`
- `src/organisms/OtrosAsociadosDetailsCard.tsx`
- `src/organisms/OtrosAsociadosConfirmationCard.tsx`
- `src/organisms/OtrosAsociadosResultCard.tsx`

---

## 4. Inscripción de Cuentas Externas (CRUD)

**Ubicación UI**: Página en:

- `app/(authenticated)/transferencias/inscribir-cuentas/page.tsx`

**Qué muestra la UI**:

- Formulario para registrar cuentas en otros bancos o cooperativas
- Selección de banco (lista de bancos)
- Tipo de cuenta (ahorros/corriente)
- Datos del titular (nombre, documento)
- Lista de cuentas ya inscritas
- Opciones para editar y eliminar cuentas inscritas
- Modal de confirmación de eliminación
- Modal de éxito al registrar

**Endpoints disponibles parcialmente**:

- `POST /transfer/external/listBanks` - Sí existe (lista de bancos)
- `POST /transfer/external/listEntities` - Sí existe (lista de entidades Coopcentral)

**Endpoints que NO existen**:

- Inscribir/registrar cuenta externa
- Listar cuentas inscritas del usuario
- Editar cuenta inscrita
- Eliminar cuenta inscrita

**Impacto**: Se puede obtener la lista de bancos/entidades, pero no se pueden realizar operaciones CRUD sobre cuentas inscritas. Toda la gestión de cuentas opera con datos mock.

**Componentes afectados**:

- `src/organisms/AccountRegistrationForm.tsx`
- `src/organisms/InscribedAccountCard.tsx`
- `src/organisms/InscribedAccountsList.tsx`
- `src/organisms/AccountSuccessModal.tsx`
- `src/organisms/AccountDeleteConfirmModal.tsx`
- `src/schemas/accountRegistrationSchema.ts`

---

## 5. Descarga de Comprobantes de Transacción

**Ubicación UI**: Botón "Descargar comprobante" en todas las pantallas de resultado:

- Aportes: `app/(authenticated)/pagos/pagar-mis-productos/aportes/resultado/`
- Obligaciones: `app/(authenticated)/pagos/pagar-mis-productos/obligaciones/resultado/`
- Protección: `app/(authenticated)/pagos/pagar-mis-productos/proteccion/respuesta/`
- Pago Unificado: `app/(authenticated)/pagos/pagar-mis-productos/pago-unificado/resultado/`
- Todas las pantallas de resultado de transferencias

**Qué muestra la UI**:

- Botón para descargar PDF del comprobante de la transacción realizada
- Datos de la transacción (número, monto, fecha, cuentas involucradas)

**Endpoint necesario**: No existe endpoint tipo `POST /transactions/receipt` o `POST /transactions/download`.

**Impacto**: Los botones de descarga de comprobante están presentes pero no pueden generar el PDF. La información de la transacción se muestra en pantalla pero no es descargable.

**Componentes afectados**:

- `src/organisms/TransactionResultCard.tsx`
- `src/organisms/AportesTransactionResultCard.tsx`
- `src/organisms/ObligacionResultCard.tsx`
- `src/organisms/ProtectionPaymentResultCard.tsx`
- `src/organisms/OtrosAsociadosResultCard.tsx`
- Todos los `*ResultCard.tsx` de transferencias

---

## 6. Gestión de Perfil de Usuario

**Ubicación UI**:

- `src/organisms/TopBar.tsx` - Muestra nombre y datos del usuario
- `src/molecules/UserAvatar.tsx` - Avatar con iniciales
- `src/molecules/UserDropdown.tsx` - Menú desplegable del usuario
- `src/contexts/UserContext.tsx` - Almacena datos del usuario

**Qué muestra la UI**:

- Nombre completo del usuario
- Tipo y número de documento
- Avatar con iniciales
- Los datos provienen exclusivamente de la respuesta del login

**Endpoints necesarios**: No existe endpoint para:

- Consultar perfil completo del usuario
- Actualizar correo electrónico
- Actualizar número de teléfono
- Actualizar dirección
- Cambiar foto/avatar

**Impacto**: El usuario no puede modificar sus datos personales desde el portal. Cualquier actualización requeriría contacto directo con Coasmedas.

---

## 7. Renovación de Sesión (Token Refresh)

**Ubicación UI**:

- `middleware.ts` - Valida JWT y controla expiración
- `src/contexts/UserContext.tsx` - Gestiona estado de autenticación
- Variable de entorno: `NEXT_PUBLIC_INACTIVITY_TIMEOUT` (default 3600s)

**Comportamiento actual**:

- El middleware verifica el claim `exp` del JWT en cada request
- Si el token expira, redirige automáticamente a `/login`
- No hay mecanismo para extender la sesión sin re-autenticarse

**Endpoint necesario**: No existe `POST /refresh-token` o `POST /extend-session`.

**Impacto**: Usuarios con sesiones largas son forzados a re-autenticarse completamente (incluyendo OTP por SMS). No hay advertencia previa ni opción de extender sesión.

---

## 8. Manejo de Retorno PSE (Callback/Webhook)

**Ubicación UI**:

- `src/hooks/usePSERedirect.ts` - Maneja redirección a gateway PSE
- Páginas de PSE redirect en aportes, obligaciones, protección, pago unificado, recargar PSE

**Comportamiento actual**:

- El hook llama a `createPayzenTransaction()` que retorna un `paymentUrl`
- El usuario es redirigido al portal externo de PSE (Payzen)
- Después del pago, el usuario debe volver manualmente al portal

**Endpoint necesario**: No existe:

- URL de callback/retorno documentada para que PSE notifique el resultado
- Endpoint para consultar estado de una transacción PSE pendiente
- Webhook para recibir confirmación asíncrona del pago

**Impacto**: Después de pagar por PSE, el usuario regresa al portal sin confirmación automática del resultado. No hay forma de verificar si el pago fue exitoso sin consultar directamente.

---

## Resumen por Prioridad

| #   | Funcionalidad                   | Severidad | Justificación                                                  |
| --- | ------------------------------- | --------- | -------------------------------------------------------------- |
| 1   | Descarga de reportes/extractos  | **Alta**  | Botón visible en 5 páginas, expectativa clara del usuario      |
| 2   | Servicios públicos              | **Alta**  | Módulo completo sin soporte; debería ocultarse o implementarse |
| 3   | Beneficiarios (otros asociados) | **Alta**  | Flujo de pago completo sin CRUD de beneficiarios               |
| 4   | Inscripción de cuentas (CRUD)   | **Alta**  | Formulario completo sin persistencia                           |
| 5   | Comprobantes de transacción     | **Media** | Botón presente pero sin funcionalidad                          |
| 6   | Perfil de usuario               | **Media** | Solo lectura; usuarios no pueden actualizar datos              |
| 7   | Renovación de sesión            | **Media** | Afecta UX pero tiene workaround (re-login)                     |
| 8   | Retorno PSE                     | **Media** | Afecta confirmación de pagos PSE                               |

---

## Recomendaciones

1. **Coordinar con equipo backend** para priorizar desarrollo de endpoints faltantes, especialmente para reportes, servicios públicos, y gestión de beneficiarios/cuentas
2. **Ocultar o deshabilitar** funcionalidades sin API hasta que exista soporte backend (evitar frustración del usuario)
3. **Implementar generación de comprobantes client-side** como alternativa temporal (generar PDF con los datos de la transacción que ya están en pantalla)
4. **Definir contrato API** para las funcionalidades faltantes y documentarlas en `docs/api-gaps.md`
