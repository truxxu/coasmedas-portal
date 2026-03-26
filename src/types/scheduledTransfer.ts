/**
 * Option for transaction type dropdown
 */
export interface TransactionTypeOption {
  value: string;
  label: string;
}

/**
 * Periodicity for scheduled transfers
 */
export type Periodicity = "unica" | "mensual" | "quincenal";

/**
 * Option for periodicity dropdown
 */
export interface PeriodicityOption {
  value: Periodicity;
  label: string;
}

/**
 * Source account for scheduled transfer
 */
export interface ScheduleSourceAccount {
  id: string;
  name: string;
  accountType: string;
  balance: number;
}

/**
 * Destination account for scheduled transfer
 */
export interface ScheduleDestinationAccount {
  id: string;
  name: string;
  accountNumber: string;
}

/**
 * Form data for scheduling a new transfer
 */
export interface ScheduledTransferFormData {
  transactionType: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
  amount?: number;
  startDate: string;
  periodicity: Periodicity;
  numberOfPayments?: number;
  concept?: string;
}

/**
 * A scheduled transfer record (for history table)
 */
export interface ScheduledTransfer {
  id: string;
  type: string;
  origin: string;
  destination: string;
  nextExecutionDate: string;
  periodicity: string;
  amount: number;
  status: string;
}
