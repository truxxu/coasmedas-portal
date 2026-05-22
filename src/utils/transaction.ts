const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export function formatNowDate(): string {
  return DATE_FORMATTER.format(new Date());
}

export function formatNowTime(): string {
  return TIME_FORMATTER.format(new Date());
}

export function generateApprovalNumber(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
