import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { useBusinesses, useCreateGroup } from "../hooks/use-groups-queries"
import { MAX_CONTEXT_FILE_SIZE_BYTES } from "../lib/constants"
import { isValidHttpUrl } from "../lib/utils"

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

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
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="context_mode"
              checked={contextMode === "preset"}
              onChange={() => setContextMode("preset")}
              disabled={createGroup.isPending}
              className="rounded-full border-input"
            />
            Preset business
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="context_mode"
              checked={contextMode === "custom"}
              onChange={() => setContextMode("custom")}
              disabled={createGroup.isPending}
              className="rounded-full border-input"
            />
            Custom
          </label>
        </div>
      </div>

      {contextMode === "preset" && (
        <div className="space-y-2">
          <Label htmlFor="business">Business context</Label>
          <Select
            value={selectedBusinessId}
            onValueChange={setSelectedBusinessId}
            disabled={createGroup.isPending || businessesLoading}
          >
            <SelectTrigger id="business" className="w-full">
              <SelectValue placeholder="Select a business…" />
            </SelectTrigger>
            <SelectContent>
              {businesses.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Use a preset context from the list (e.g. Brighterly, Dressly).
          </p>
        </div>
      )}

      {contextMode === "custom" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="context_file">
              Context file (.md, max 1 MB) — optional
            </Label>
            <Input
              id="context_file"
              type="file"
              accept=".md"
              onChange={(e) => setContextFile(e.target.files?.[0] ?? null)}
              disabled={createGroup.isPending}
              className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium"
            />
          </div>
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
        <Label htmlFor="num_chats">Number of chats</Label>
        <Input
          id="num_chats"
          type="number"
          min={1}
          value={numChats}
          onChange={(e) => setNumChats(Number(e.target.value))}
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
