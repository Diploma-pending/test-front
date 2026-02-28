import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Building2, FileUp } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { BusinessIcon } from "./business-icon"
import { cn } from "@/shared/lib/styles"
import { useBusinesses, useCreateGroup } from "../hooks/use-groups-queries"
import { MAX_CONTEXT_FILE_SIZE_BYTES } from "../lib/constants"
import { isValidHttpUrl } from "../lib/utils"
import { ContextFileDropzone } from "./context-file-dropzone"

type ContextMode = "preset" | "custom"

export const GroupCreateForm = () => {
  const navigate = useNavigate()
  const createGroup = useCreateGroup()
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses()
  const [contextMode, setContextMode] = useState<ContextMode>("preset")
  const [selectedBusinessId, setSelectedBusinessId] = useState("")
  const [contextFile, setContextFile] = useState<File | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [numChats, setNumChats] = useState(8)
  const [error, setError] = useState<string | null>(null)

  const MAX_CHATS = 20

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const clampedChats = Math.min(MAX_CHATS, Math.max(1, numChats))
    if (clampedChats !== numChats) {
      setNumChats(clampedChats)
      return
    }

    if (contextMode === "preset") {
      if (!selectedBusinessId) {
        setError("Select a business context")
        return
      }
      createGroup.mutate(
        {
          business: selectedBusinessId,
          numChats,
        },
        {
          onSuccess: (data) => {
            navigate({
              to: "/groups/$groupId",
              params: { groupId: data.group_id },
            })
          },
          onError: (err) => {
            setError(err instanceof Error ? err.message : String(err))
          },
        },
      )
      return
    }

    const hasFile = Boolean(contextFile)
    const hasUrl = Boolean(websiteUrl.trim())

    if (hasFile && contextFile) {
      if (!contextFile.name.endsWith(".md")) {
        setError("Context file must be a .md file")
        return
      }
      if (contextFile.size > MAX_CONTEXT_FILE_SIZE_BYTES) {
        setError("Context file must be ≤ 1 MB")
        return
      }
    }

    if (hasUrl && !isValidHttpUrl(websiteUrl.trim())) {
      setError("Website URL must be a valid http or https URL with a hostname")
      return
    }

    createGroup.mutate(
      {
        business: "custom",
        ...(hasFile && contextFile && { contextFile }),
        ...(hasUrl && { websiteUrl: websiteUrl.trim() }),
        numChats,
      },
      {
        onSuccess: (data) => {
          navigate({
            to: "/groups/$groupId",
            params: { groupId: data.group_id },
          })
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : String(err))
        },
      },
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-xl">
      <div className="space-y-2">
        <span className="block text-sm font-medium">Context</span>
        <div
          className="grid gap-2 sm:grid-cols-2 sm:gap-3"
          role="radiogroup"
          aria-label="Context mode"
        >
          <label
            className={cn(
              "flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-4 transition-all duration-200",
              "hover:border-primary/40 hover:bg-secondary/40",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
              contextMode === "preset"
                ? "border-primary bg-primary/10"
                : "border-border bg-card/50",
              createGroup.isPending && "pointer-events-none opacity-60",
            )}
          >
            <input
              type="radio"
              name="context_mode"
              value="preset"
              checked={contextMode === "preset"}
              onChange={() => setContextMode("preset")}
              disabled={createGroup.isPending}
              className="sr-only"
            />
            <Building2 className="size-5 shrink-0 text-muted-foreground" />
            <span className="font-medium">Preset business</span>
            <span className="text-xs text-muted-foreground">
              Use a Skelar portfolio context
            </span>
          </label>
          <label
            className={cn(
              "flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-4 transition-all duration-200",
              "hover:border-primary/40 hover:bg-secondary/40",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
              contextMode === "custom"
                ? "border-primary bg-primary/10"
                : "border-border bg-card/50",
              createGroup.isPending && "pointer-events-none opacity-60",
            )}
          >
            <input
              type="radio"
              name="context_mode"
              value="custom"
              checked={contextMode === "custom"}
              onChange={() => setContextMode("custom")}
              disabled={createGroup.isPending}
              className="sr-only"
            />
            <FileUp className="size-5 shrink-0 text-muted-foreground" />
            <span className="font-medium">Custom</span>
            <span className="text-xs text-muted-foreground">
              Upload file or paste URL
            </span>
          </label>
        </div>
      </div>

      {contextMode === "preset" && (
        <div className="space-y-2">
          <span className="block text-sm font-medium">Business context</span>
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            role="radiogroup"
            aria-label="Select a business context"
          >
            {businesses.map((b) => {
              const isChecked = selectedBusinessId === b.id
              return (
                <label
                  key={b.id}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200",
                    "hover:border-primary/40 hover:bg-secondary/40",
                    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                    isChecked
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card/50",
                    (createGroup.isPending || businessesLoading) &&
                      "pointer-events-none opacity-60",
                  )}
                >
                  <input
                    type="radio"
                    name="business"
                    value={b.id}
                    checked={isChecked}
                    onChange={() => setSelectedBusinessId(b.id)}
                    disabled={createGroup.isPending || businessesLoading}
                    className="sr-only"
                  />
                  <BusinessIcon id={b.id} className="size-8 shrink-0" />
                  <span className="text-center text-sm font-medium">
                    {b.label}
                  </span>
                </label>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Use a preset context from the list (e.g. Brighterly, Dressly).
          </p>
        </div>
      )}

      {contextMode === "custom" && (
        <>
          <ContextFileDropzone
            contextFile={contextFile}
            setContextFile={setContextFile}
            disabled={createGroup.isPending}
          />
          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL — optional</Label>
            <Input
              id="website_url"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example-shop.com"
              disabled={createGroup.isPending}
            />
            <p className="text-xs text-muted-foreground">
              For custom context: provide a .md file and/or website URL, or leave both empty and the backend will resolve context.
            </p>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="num_chats">Number of chats (1–{MAX_CHATS})</Label>
        <Input
          id="num_chats"
          min={1}
          max={MAX_CHATS}
          value={numChats}
          onChange={(e) => setNumChats(Number(e.target.value) || 0)}
          onBlur={() =>
            setNumChats((n) =>
              Number.isNaN(n) || n < 1 ? 1 : Math.min(MAX_CHATS, n),
            )
          }
          disabled={createGroup.isPending}
        />
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive animate-fade-in transition-opacity duration-200">
          {error}
        </div>
      )}

      <Button type="submit" disabled={createGroup.isPending}>
        {createGroup.isPending ? "Creating..." : "Create group"}
      </Button>
    </form>
  )
}
