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
} from "./auth.service";

export {
  getBalances,
  getMovements,
  getConsolidatedMovements,
  getProductsSavings,
  getProductsCredits,
  getProductsInvestments,
  getProductsContributions,
  getProductsProtection,
} from "./products.service";

export {
  getPaymentProducts,
  getPaymentSourcesSavings,
  getPaymentSourcesCredits,
  createPaymentTransaction,
  createPayzenTransaction,
  getPaymentProtection,
} from "./payments.service";

export {
  getTransferSourcesSavings,
  getTransferSourcesCredits,
  getTransferSourcesInvestments,
  getTransferTargetsSavings,
  getTransferTargetsCredits,
  getTransferTargetsInvestments,
  createInternalTransfer,
  getExternalSourcesSavings,
  getExternalSourcesCredits,
  listBanks,
  getTransactionCost,
  createExternalBankTransfer,
  listEntities,
  queryEntityProduct,
  createExternalEntityTransfer,
} from "./transfers.service";

export {
  listBrebAccounts,
  listBrebKeys,
  resolveBrebKey,
  createBrebKey,
  updateBrebKey,
  deleteBrebKey,
  blockBrebKey,
  unblockBrebKey,
  acceptBrebTerms,
  initBrebTx,
  getBrebTxStatus,
  listBrebTxs,
} from "./breb.service";
