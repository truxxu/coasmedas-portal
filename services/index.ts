// Prefer importing directly from individual service files to enable tree-shaking:
//   import { login, getSalt } from '@/services/auth.service';
//
// Namespace re-exports below are provided for convenience but may prevent
// dead-code elimination in client bundles. Use direct imports in components.

export {
  getSalt,
  sendOtp,
  login,
  sendTransactionOtp,
  validateUser,
  register,
  updatePassword,
} from './auth.service';
