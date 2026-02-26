import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/groups/$groupId")({
  component: GroupsGroupIdLayout,
})

function GroupsGroupIdLayout() {
  return <Outlet />
}
