import { createFileRoute } from "@tanstack/react-router"
import { GroupCreatePage } from "@/pages/group-create-page"

export const Route = createFileRoute("/")({
  component: GroupCreatePage,
})
