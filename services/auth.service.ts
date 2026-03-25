/**
 * Auth Service
 *
 * Handles authentication, registration, and password management.
 * Uses client-side apiPost for browser requests.
 *
 * @see /docs/CONSOLIDATED_API_REFERENCE.md#1-authentication
 * @see /docs/CONSOLIDATED_API_REFERENCE.md#2-registration
 * @see /docs/CONSOLIDATED_API_REFERENCE.md#3-password-management
 */

import { apiPost } from "@/lib/api/client";
import type {
  GetSaltRequest,
  GetSaltResponse,
  SendOtpRequest,
  SendOtpResponse,
  LoginRequest,
  LoginResponse,
  SendTransactionOtpRequest,
  SendTransactionOtpResponse,
  UserValidationRequest,
  RegisterRequest,
  RegisterResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
} from "@/types/api/auth";

// ─── Authentication ───

/**
 * Retrieve BCrypt salt for password hashing before login or password change.
 *
 * @endpoint POST /get-salt
 * @auth None
 * @status ✅ Used in mobile
 */
export async function getSalt(
  params: GetSaltRequest,
): Promise<GetSaltResponse> {
  return apiPost<GetSaltResponse>("/get-salt", params);
}

/**
 * Send OTP to user's registered mobile number via SMS.
 *
 * @endpoint POST /send-otp
 * @auth None
 * @status ✅ Used in mobile
 */
export async function sendOtp(
  params: SendOtpRequest,
): Promise<SendOtpResponse> {
  return apiPost<SendOtpResponse>("/send-otp", params);
}

/**
 * Authenticate user and obtain JWT token.
 * Password must be the BCrypt hash (60 chars) using salt from /get-salt.
 *
 * @endpoint POST /login
 * @auth None
 * @status ✅ Used in mobile
 */
export async function login(params: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginResponse>("/login", params);
}

/**
 * Send OTP for transaction confirmation (payments/transfers).
 *
 * @endpoint POST /send-otp/transaction
 * @auth None
 * @status ✅ Used in mobile
 */
export async function sendTransactionOtp(
  params: SendTransactionOtpRequest,
): Promise<SendTransactionOtpResponse> {
  return apiPost<SendTransactionOtpResponse>("/send-otp/transaction", params);
}

// ─── Registration ───

/**
 * Validate that a user exists in the core banking system before registration.
 * Returns confirmation only (no payload). Throws ApiError 101 if not found.
 *
 * @endpoint POST /userValidation
 * @auth None
 * @status ✅ Used in mobile
 */
export async function validateUser(
  params: UserValidationRequest,
): Promise<void> {
  await apiPost<void>("/userValidation", params);
}

/**
 * Register a new user in the portal.
 * Note: The returned `token` is a placeholder ("string"), NOT a valid JWT.
 * User must log in separately after registration.
 *
 * @endpoint POST /register
 * @auth None
 * @status ✅ Used in mobile
 */
export async function register(
  params: RegisterRequest,
): Promise<RegisterResponse> {
  return apiPost<RegisterResponse>("/register", params);
}

// ─── Password Management ───

/**
 * Update user password. Requires OTP verification.
 *
 * @endpoint POST /update-password
 * @auth None
 * @status ✅ Used in mobile
 */
export async function updatePassword(
  params: UpdatePasswordRequest,
): Promise<UpdatePasswordResponse> {
  return apiPost<UpdatePasswordResponse>("/update-password", params);
}
