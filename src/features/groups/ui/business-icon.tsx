import { BUSINESS_ICON_URLS } from "../lib/business-icons"
import { cn } from "@/shared/lib/styles"

type BusinessIconProps = {
  id: string
  className?: string
  alt?: string
}

export const BusinessIcon = ({ id, className, alt = "" }: BusinessIconProps) => {
  const src = BUSINESS_ICON_URLS[id.toLowerCase()]
  if (!src) return null
  return (
    <img
      src={src}
      alt={alt || `${id} logo`}
      className={cn("shrink-0 object-contain invert opacity-90", className)}
      loading="lazy"
      decoding="async"
    />
  )
}
