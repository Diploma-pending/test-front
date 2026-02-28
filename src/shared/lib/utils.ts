import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Display name for a chat by 1-based index, e.g. "Chat 001", "Chat 002". */
export function getChatDisplayName(index: number): string {
  const n = Math.max(1, Math.floor(index))
  return `Chat ${String(n).padStart(3, "0")}`
}
