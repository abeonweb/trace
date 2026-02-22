import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function buildUrl(params: URLSearchParams) {
  const queryStr = params.toString();
  return queryStr ? `/?${queryStr}` : "/";
}

export function formatDate(iso: string, locale: string = "en") {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}