const IST = "Asia/Kolkata";

export function todayISO(date = new Date()) {
  return date.toLocaleDateString("en-CA", { timeZone: IST });
}

export function parseISODate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDisplayDate(value: Date | string) {
  const date = typeof value === "string" ? parseISODate(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: IST,
  }).format(value);
}
