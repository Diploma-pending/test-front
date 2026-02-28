import { useState, useRef } from "react"
import { FileUp, FileText, X } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { cn } from "@/shared/lib/styles"
import { MAX_CONTEXT_FILE_SIZE_BYTES } from "../lib/constants"

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type ContextFileDropzoneProps = {
  contextFile: File | null
  setContextFile: (f: File | null) => void
  disabled?: boolean
}

export const ContextFileDropzone = ({
  contextFile,
  setContextFile,
  disabled,
}: ContextFileDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dropError, setDropError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDropError(null)
  }

  const validateFile = (file: File): string | null => {
    if (!file.name.toLowerCase().endsWith(".md")) {
      return "Only .md files are allowed"
    }
    if (file.size > MAX_CONTEXT_FILE_SIZE_BYTES) {
      return `File must be ≤ 1 MB (${formatFileSize(file.size)})`
    }
    return null
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDropError(null)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    const err = validateFile(file)
    if (err) {
      setDropError(err)
      return
    }
    setContextFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDropError(null)
    const file = e.target.files?.[0]
    if (!file) return
    const err = validateFile(file)
    if (err) {
      setDropError(err)
      return
    }
    setContextFile(file)
    e.target.value = ""
  }

  const handleRemove = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setContextFile(null)
    setDropError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-2">
      <Label>Context file (.md, max 1 MB) — optional</Label>
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !contextFile && !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            if (!contextFile && !disabled) inputRef.current?.click()
          }
        }}
        className={cn(
          "relative flex min-h-[120px] flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isDragging && "border-primary bg-primary/10 scale-[1.01]",
          !isDragging && "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/50",
          contextFile && "border-solid border-border bg-card/50",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".md"
          onChange={handleFileChange}
          className="sr-only"
          aria-hidden
        />
        {contextFile ? (
          <div className="flex w-full items-center gap-3 px-4 py-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {contextFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(contextFile.size)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 size-8 text-muted-foreground hover:text-destructive"
              onClick={handleRemove}
              disabled={disabled}
              aria-label="Remove file"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <>
            <FileUp className="size-6 shrink-0 text-muted-foreground mb-1" />
            <p className="text-center text-sm font-medium text-foreground">
              {isDragging ? "Drop your .md file here" : "Drag and drop .md here"}
            </p>
            <p className="text-center text-xs text-muted-foreground mt-0.5">
              or click to browse · max 1 MB
            </p>
          </>
        )}
      </div>
      {dropError && (
        <p className="text-xs text-destructive animate-fade-in">{dropError}</p>
      )}
    </div>
  )
}
