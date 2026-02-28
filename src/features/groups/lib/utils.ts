import { match } from "ts-pattern"
import type { GroupStatus } from "@/shared/api/types"

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

export type StatusBadgeVariant = "default" | "secondary" | "destructive" | "outline"

export const getStatusBadgeVariant = (status: GroupStatus): StatusBadgeVariant =>
  match(status)
    .with("context_gathering_failed", "generation_failed", "analysis_failed", () => "destructive" as const)
    .with("completed", () => "default" as const)
    .otherwise(() => "secondary" as const)

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

/** Formatted for list/card display: "Feb 28, 2025, 3:45 PM" */
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
