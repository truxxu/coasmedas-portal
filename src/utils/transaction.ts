export function formatNowDate(): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function formatNowTime(): string {
  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

export function generateApprovalNumber(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
