// src/lib/timeUtils.ts

export function getHariIni(): string {
  const now = new Date();
  return now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getHariBesok(): string {
  const besok = new Date();
  besok.setDate(besok.getDate() + 1);
  return besok.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
