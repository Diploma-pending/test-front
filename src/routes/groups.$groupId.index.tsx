import { createFileRoute } from "@tanstack/react-router"
import { GroupChatsList } from "@/features/groups/ui/group-chats-list"

export const Route = createFileRoute("/groups/$groupId/")({
  component: GroupChatsListPage,
})

function GroupChatsListPage() {
  const { groupId } = Route.useParams()
  return <GroupChatsList groupId={groupId} />
}
