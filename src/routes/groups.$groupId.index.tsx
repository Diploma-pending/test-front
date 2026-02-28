import { createFileRoute, notFound } from "@tanstack/react-router"
import { ApiError } from "@/shared/api/client"
import { getGroupChats } from "@/shared/api/client"
import { GroupChatsList } from "@/features/groups/ui/group-chats-list"

export const Route = createFileRoute("/groups/$groupId/")({
  loader: async ({ params }) => {
    try {
      await getGroupChats(params.groupId)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        throw notFound()
      }
      throw err
    }
  },
  component: GroupChatsListPage,
})

function GroupChatsListPage() {
  const { groupId } = Route.useParams()
  return <GroupChatsList groupId={groupId} />
}
