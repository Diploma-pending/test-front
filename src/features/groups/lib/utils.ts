import { match } from "ts-pattern"
import type { ChatStatus, GroupStatus } from "@/shared/api/types"

export const getGroupStatusMessage = (status: GroupStatus): string =>
  match(status)
    .with("gathering_context", () => "Fetching website and generating context…")
    .with("context_gathering_failed", () => "Context gathering failed.")
    .with("generating", () => "Generating chats…")
    .with("generated", () => "All chats generated. Run analysis to continue.")
    .with("generation_failed", () => "Generation failed.")
    .with("analyzing", () => "Analyzing chats…")
    .with("completed", () => "Analysis complete.")
    .with("analysis_failed", () => "Analysis failed.")
    .exhaustive()

export type StatusBadgeVariant =
  | "destructive"
  | "success"
  | "warning"
  | "secondary"

export const getStatusBadgeVariant = (status: GroupStatus): StatusBadgeVariant =>
  match(status)
    .with("context_gathering_failed", "generation_failed", "analysis_failed", () => "destructive" as const)
    .with("completed", () => "success" as const)
    .with("gathering_context", "generating", "analyzing", () => "warning" as const)
    .otherwise(() => "secondary" as const)

export const getStatusBadgeClassName = (status: GroupStatus): string => {
  const variant = getStatusBadgeVariant(status)
  return match(variant)
    .with("destructive", () => "bg-destructive/15 text-destructive")
    .with("success", () => "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400")
    .with("warning", () => "bg-amber-500/15 text-amber-600 dark:text-amber-400")
    .with("secondary", () => "bg-secondary text-secondary-foreground")
    .exhaustive()
}

export const formatStatusLabel = (status: string): string =>
  status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")

export const getChatStatusBadgeClassName = (status: ChatStatus): string =>
  match(status)
    .with("failed", () => "bg-destructive/15 text-destructive")
    .with("analyzed", () => "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400")
    .with("generating", "analyzing", () => "bg-amber-500/15 text-amber-600 dark:text-amber-400")
    .with("pending", "generated", () => "bg-secondary/80 text-muted-foreground")
    .exhaustive()

export const formatGroupDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

export const formatGroupDateList = (iso: string): string => {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

export const isValidHttpUrl = (str: string): boolean => {
  try {
    const url = new URL(str)
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    )
  } catch {
    return false
  }
}
