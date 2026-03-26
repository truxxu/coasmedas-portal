import type {
  TransactionTypeOption,
  PeriodicityOption,
  ScheduleSourceAccount,
  ScheduleDestinationAccount,
  ScheduledTransfer,
} from "@/src/types/scheduledTransfer";

/**
 * Transaction type options for scheduled transfers
 */
export const TRANSACTION_TYPE_OPTIONS: TransactionTypeOption[] = [
  { value: "otros_bancos", label: "Transferencia a otros bancos" },
  { value: "mi_red", label: "Transferencia a mi red" },
  { value: "obligacion", label: "Pago de Obligación" },
];

/**
 * Periodicity options
 */
export const PERIODICITY_OPTIONS: PeriodicityOption[] = [
  { value: "unica", label: "Única vez" },
  { value: "mensual", label: "Mensual" },
  { value: "quincenal", label: "Quincenal" },
];

/**
 * Mock source accounts for scheduled transfers
 */
export const mockScheduleSourceAccounts: ScheduleSourceAccount[] = [
  {
    id: "savings-1",
    name: "Cuenta de Ahorros",
    accountType: "ahorros",
    balance: 8730500,
  },
];

/**
 * Mock destination accounts (registered external accounts)
 */
export const mockScheduleDestinationAccounts: ScheduleDestinationAccount[] = [
  {
    id: "dest-1",
    name: "Cuenta Mamá",
    accountNumber: "***6745",
  },
  {
    id: "dest-2",
    name: "Valeria Alvarado",
    accountNumber: "***1234",
  },
];

/**
 * Mock scheduled transfers for history table
 */
export const mockScheduledTransfers: ScheduledTransfer[] = [
  {
    id: "sched-1",
    type: "Pago de Obligación",
    origin: "Cuenta Ahorros ***4428",
    destination: "Obligación ***7891",
    nextExecutionDate: "15/03/2026",
    periodicity: "Mensual",
    amount: 450000,
    status: "2/12",
  },
  {
    id: "sched-2",
    type: "Transferencia a mi red",
    origin: "Cuenta Ahorros ***4428",
    destination: "Cuenta Mamá ***6745",
    nextExecutionDate: "01/04/2026",
    periodicity: "Quincenal",
    amount: 200000,
    status: "Activa",
  },
  {
    id: "sched-3",
    type: "Transferencia a otros bancos",
    origin: "Cuenta Ahorros ***4428",
    destination: "Valeria Alvarado ***1234",
    nextExecutionDate: "20/03/2026",
    periodicity: "Única vez",
    amount: 1500000,
    status: "Activa",
  },
];
