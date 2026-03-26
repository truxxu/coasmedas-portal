import type { LoginResponse } from "@/types/api/auth";
import type { User, Session } from "@/src/types";
import { normalizeString } from "@/types/api/common";

/**
 * Map the API LoginResponse to the frontend User type.
 * Splits fullName into firstName/lastName for UserAvatar and UserDropdown compatibility.
 */
export function mapLoginResponseToUser(
  data: Omit<LoginResponse, "token">,
): User {
  const fullName = data.fullName || "";
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    firstName,
    lastName,
    fullName,
    documentType: data.documentType,
    documentNumber: normalizeString(data.documentNumber),
    email: data.email,
    mobile: normalizeString(data.mobile),
    phone: normalizeString(data.phone),
    address: data.address,
    city: data.city,
    state: data.state,
  };
}

/**
 * Create a new session object with current timestamps.
 */
export function createSession(): Session {
  const now = new Date();
  return {
    lastLogin: now,
    currentLogin: now,
    ipAddress: "",
  };
}
