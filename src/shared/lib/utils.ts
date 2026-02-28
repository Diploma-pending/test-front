/** Display name for a chat by 1-based index, e.g. "Chat 001", "Chat 002". */
export const getChatDisplayName = (index: number): string => {
  const n = Math.max(1, Math.floor(index))
  return `Chat ${String(n).padStart(3, "0")}`
}
