import { createFileRoute } from "@tanstack/react-router"
import { GroupsListPage } from "@/pages/groups-list-page"

export const Route = createFileRoute("/groups/" as const)({
  component: GroupsListPage,
})
