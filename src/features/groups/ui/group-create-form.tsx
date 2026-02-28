import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/shared/ui/button"
import { useBusinesses, useCreateGroup } from "../api/queries"

const MAX_FILE_SIZE = 1024 * 1024 // 1 MB

type ContextMode = "preset" | "custom"

function isValidHttpUrl(str: string): boolean {
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

export const GroupCreateForm = () => {
  const navigate = useNavigate()
  const createGroup = useCreateGroup()
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses()
  const [topic, setTopic] = useState("")
  const [contextMode, setContextMode] = useState<ContextMode>("preset")
  const [selectedBusinessId, setSelectedBusinessId] = useState("")
  const [contextFile, setContextFile] = useState<File | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [numChats, setNumChats] = useState(8)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!topic.trim()) {
      setError("Topic is required")
      return
    }

    if (contextMode === "preset") {
      if (!selectedBusinessId) {
        setError("Select a business context")
        return
      }
      createGroup.mutate(
        {
          topic: topic.trim(),
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
      if (contextFile.size > MAX_FILE_SIZE) {
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
        topic: topic.trim(),
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      <div className="space-y-2">
        <label htmlFor="topic" className="block text-sm font-medium">
          Topic
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. e-commerce platform"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          disabled={createGroup.isPending}
        />
      </div>

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
          <label htmlFor="business" className="block text-sm font-medium">
            Business context
          </label>
          <select
            id="business"
            value={selectedBusinessId}
            onChange={(e) => setSelectedBusinessId(e.target.value)}
            disabled={createGroup.isPending || businessesLoading}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select a business…</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Use a preset context from the list (e.g. Brighterly, Dressly).
          </p>
        </div>
      )}

      {contextMode === "custom" && (
        <>
          <div className="space-y-2">
            <label htmlFor="context_file" className="block text-sm font-medium">
              Context file (.md, max 1 MB) — optional
            </label>
            <input
              id="context_file"
              type="file"
              accept=".md"
              onChange={(e) => setContextFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium"
              disabled={createGroup.isPending}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="website_url" className="block text-sm font-medium">
              Website URL — optional
            </label>
            <input
              id="website_url"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example-shop.com"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              disabled={createGroup.isPending}
            />
            <p className="text-xs text-muted-foreground">
              For custom context: provide a .md file and/or website URL, or leave both empty to use topic only (backend will resolve).
            </p>
          </div>
        </>
      )}

      <div className="space-y-2">
        <label htmlFor="num_chats" className="block text-sm font-medium">
          Number of chats
        </label>
        <input
          id="num_chats"
          type="number"
          min={1}
          value={numChats}
          onChange={(e) => setNumChats(Number(e.target.value) || 8)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          disabled={createGroup.isPending}
        />
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" disabled={createGroup.isPending}>
        {createGroup.isPending ? "Creating..." : "Create group"}
      </Button>
    </form>
  )
}
