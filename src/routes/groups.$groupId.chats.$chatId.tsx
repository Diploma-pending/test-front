import { createFileRoute, notFound } from "@tanstack/react-router"
import { ApiError, getChatDetail } from "@/shared/api/client"
import { GroupChatDetailPage } from "@/pages/group-chat-detail-page"

const GroupChatDetailRoute = () => {
  const { groupId, chatId } = Route.useParams()
  return <GroupChatDetailPage groupId={groupId} chatId={chatId} />
}

export const Route = createFileRoute("/groups/$groupId/chats/$chatId")({
  loader: async ({ params }) => {
    try {
      await getChatDetail(params.groupId, params.chatId)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        throw notFound()
      }
      throw err
    }
  },
  component: GroupChatDetailRoute,
})
