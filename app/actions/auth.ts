'use server';

import { serverApiPost } from '@/lib/api/server-client';
import { setAuthCookie, clearAuthCookie } from '@/lib/auth/tokens';
import type {
  GetSaltRequest,
  GetSaltResponse,
  SendOtpRequest,
  SendOtpResponse,
  LoginRequest,
  LoginResponse,
  UserValidationRequest,
  RegisterRequest,
  RegisterResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
} from '@/types/api/auth';
import { isApiError, getErrorMessage } from '@/lib/api/errors';

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action: Get BCrypt salt for password hashing.
 *
 * @endpoint POST /get-salt
 * @auth None
 */
export async function getSaltAction(
  params: GetSaltRequest,
): Promise<ActionResult<GetSaltResponse>> {
  try {
    const data = await serverApiPost<GetSaltResponse>('/get-salt', params);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: isApiError(error) ? getErrorMessage(error) : 'Error al obtener el salt',
    };
  }
}

/**
 * Server Action: Send OTP to user's mobile number.
 *
 * @endpoint POST /send-otp
 * @auth None
 */
export async function sendOtpAction(
  params: SendOtpRequest,
): Promise<ActionResult<SendOtpResponse>> {
  try {
    const data = await serverApiPost<SendOtpResponse>('/send-otp', params);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: isApiError(error) ? getErrorMessage(error) : 'Error al enviar el código OTP',
    };
  }
}

/**
 * Server Action: Authenticate user, store JWT in HttpOnly cookie.
 *
 * @endpoint POST /login
 * @auth None
 */
export async function loginAction(
  params: LoginRequest,
): Promise<ActionResult<{ userData: Omit<LoginResponse, 'token'>; token: string }>> {
  try {
    const data = await serverApiPost<LoginResponse>('/login', params);

    // Store JWT in HttpOnly secure cookie
    await setAuthCookie(data.token);

    // Return user data and token (token also needed client-side for Axios interceptor)
    const { token, ...userData } = data;
    return { success: true, data: { userData, token } };
  } catch (error) {
    return {
      success: false,
      error: isApiError(error) ? getErrorMessage(error) : 'Error en el inicio de sesión',
    };
  }
}

/**
 * Server Action: Clear auth cookie and end session.
 */
export async function logoutAction(): Promise<ActionResult> {
  try {
    await clearAuthCookie();
    return { success: true };
  } catch {
    return { success: false, error: 'Error al cerrar sesión' };
  }
}

/**
 * Server Action: Validate user exists in core banking (pre-registration).
 *
 * @endpoint POST /userValidation
 * @auth None
 */
export async function validateUserAction(
  params: UserValidationRequest,
): Promise<ActionResult> {
  try {
    await serverApiPost<void>('/userValidation', params);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: isApiError(error) ? getErrorMessage(error) : 'Error al validar el usuario',
    };
  }
}

/**
 * Server Action: Register a new user.
 *
 * @endpoint POST /register
 * @auth None
 */
export async function registerAction(
  params: RegisterRequest,
): Promise<ActionResult<RegisterResponse>> {
  try {
    const data = await serverApiPost<RegisterResponse>('/register', params);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: isApiError(error) ? getErrorMessage(error) : 'Error en el registro',
    };
  }
}

/**
 * Server Action: Update user password.
 *
 * @endpoint POST /update-password
 * @auth None
 */
export async function updatePasswordAction(
  params: UpdatePasswordRequest,
): Promise<ActionResult<UpdatePasswordResponse>> {
  try {
    const data = await serverApiPost<UpdatePasswordResponse>('/update-password', params);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: isApiError(error) ? getErrorMessage(error) : 'Error al actualizar la contraseña',
    };
  }
}
