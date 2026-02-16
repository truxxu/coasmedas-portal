import type { AxiosError } from "axios";

/**
 * API error codes from the Coasmedas backend.
 * @see /docs/CONSOLIDATED_API_REFERENCE.md#error-codes
 */
export const API_ERROR_CODES = {
  SUCCESS: 0,
  LOGIN_ERROR: 1,
  VALIDATION_ERROR: 2,
  USER_ALREADY_REGISTERED: 4,
  USER_NOT_FOUND: 101,
  MOBILE_FORMAT_ERROR: 102,
  EMAIL_FORMAT_ERROR: 103,
  CORE_BANKING_ERROR: 105,
  INVALID_OTP: 106,
  UNAUTHORIZED: 107,
  VISIONAMOS_WS_ERROR: 108,
  PAYZEN_WS_ERROR: 109,
  PAYZEN_REJECTION: 110,
  PAYZEN_NO_RESPONSE: 111,
  VISIONAMOS_TXN_WS_ERROR: 112,
  VISIONAMOS_TXN_REJECTED: 113,
  VISIONAMOS_NO_RESPONSE: 114,
  INALAMBRIA_ERROR: 116,
  BREB_VISIONAMOS_ERROR: 500,
} as const;

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

const ERROR_MESSAGES: Record<number, string> = {
  [API_ERROR_CODES.LOGIN_ERROR]: "Error en el inicio de sesión",
  [API_ERROR_CODES.VALIDATION_ERROR]: "Los datos ingresados no son válidos",
  [API_ERROR_CODES.USER_ALREADY_REGISTERED]:
    "El usuario ya se encuentra registrado",
  [API_ERROR_CODES.USER_NOT_FOUND]: "Usuario no encontrado",
  [API_ERROR_CODES.MOBILE_FORMAT_ERROR]:
    "Error en el formato del número móvil. Contacte soporte",
  [API_ERROR_CODES.EMAIL_FORMAT_ERROR]:
    "Error en el formato del correo electrónico. Contacte soporte",
  [API_ERROR_CODES.CORE_BANKING_ERROR]:
    "Error de comunicación con el sistema bancario. Intente nuevamente",
  [API_ERROR_CODES.INVALID_OTP]:
    "Código OTP inválido. Por favor verifique e intente nuevamente",
  [API_ERROR_CODES.UNAUTHORIZED]:
    "Sesión expirada. Por favor inicie sesión nuevamente",
  [API_ERROR_CODES.VISIONAMOS_WS_ERROR]:
    "Error en el servicio de transferencias externas",
  [API_ERROR_CODES.PAYZEN_WS_ERROR]: "Error en el servicio de pago PSE",
  [API_ERROR_CODES.PAYZEN_REJECTION]: "El pago PSE fue rechazado",
  [API_ERROR_CODES.PAYZEN_NO_RESPONSE]:
    "El servicio de pago PSE no respondió. Intente nuevamente",
  [API_ERROR_CODES.VISIONAMOS_TXN_WS_ERROR]: "Error en la transacción externa",
  [API_ERROR_CODES.VISIONAMOS_TXN_REJECTED]: "La transacción fue rechazada",
  [API_ERROR_CODES.VISIONAMOS_NO_RESPONSE]:
    "El servicio externo no respondió. Intente nuevamente",
  [API_ERROR_CODES.INALAMBRIA_ERROR]:
    "Error al enviar el código SMS. Intente nuevamente",
  [API_ERROR_CODES.BREB_VISIONAMOS_ERROR]: "Error en el servicio BRE-B",
};

export class ApiError extends Error {
  readonly statusCode: number;
  readonly statusDesc: string;
  readonly httpStatus?: number;

  constructor(statusCode: number, statusDesc: string, httpStatus?: number) {
    super(statusDesc);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.statusDesc = statusDesc;
    this.httpStatus = httpStatus;
  }
}

export class AuthError extends ApiError {
  constructor(
    statusDesc: string = ERROR_MESSAGES[API_ERROR_CODES.UNAUTHORIZED],
  ) {
    super(API_ERROR_CODES.UNAUTHORIZED, statusDesc, 401);
    this.name = "AuthError";
  }
}

export class ValidationError extends ApiError {
  constructor(
    statusDesc: string = ERROR_MESSAGES[API_ERROR_CODES.VALIDATION_ERROR],
  ) {
    super(API_ERROR_CODES.VALIDATION_ERROR, statusDesc, 400);
    this.name = "ValidationError";
  }
}

export class NetworkError extends ApiError {
  constructor(
    message: string = "Error de conexión. Verifique su conexión a internet",
  ) {
    super(-1, message);
    this.name = "NetworkError";
  }
}

/**
 * Parse an Axios error into a typed ApiError.
 *
 * Error extraction priority:
 * 1. payload.error.stateDescriptionCustomer (BRE-B upstream errors)
 * 2. statusDesc from response envelope
 * 3. Axios error message
 */
export function parseApiError(
  error: AxiosError<{
    statusCode?: number;
    statusDesc?: string;
    payload?: Record<string, unknown>;
  }>,
): ApiError {
  console.log("parseApiError", error);
  if (!error.response) {
    return new NetworkError();
  }

  const { data, status } = error.response;

  if (!data || typeof data.statusCode === "undefined") {
    return new ApiError(-1, error.message || "Error desconocido", status);
  }

  const statusCode = data.statusCode;
  const payload = data.payload as Record<string, unknown> | undefined;
  const upstreamError = payload?.error as Record<string, unknown> | undefined;

  const statusDesc =
    (upstreamError?.stateDescriptionCustomer as string) ||
    data.statusDesc ||
    error.message ||
    "Error desconocido";

  if (statusCode === API_ERROR_CODES.UNAUTHORIZED) {
    return new AuthError(statusDesc);
  }

  if (statusCode === API_ERROR_CODES.VALIDATION_ERROR) {
    return new ValidationError(statusDesc);
  }

  return new ApiError(statusCode, statusDesc, status);
}

/**
 * Get a user-friendly Spanish error message for an API error.
 */
export function getErrorMessage(error: ApiError): string {
  return (
    ERROR_MESSAGES[error.statusCode] ||
    error.statusDesc ||
    "Ha ocurrido un error inesperado"
  );
}

/**
 * Type guard to check if an unknown error is an ApiError.
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard to check if an error is an auth error (code 107).
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}
