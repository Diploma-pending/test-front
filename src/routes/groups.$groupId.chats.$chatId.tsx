import { createFileRoute, notFound } from "@tanstack/react-router"
import { ApiError, getChatDetail } from "@/shared/api/client"
import { ChatDetailsPage } from "@/features/chats/ui/chat-details"

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
  component: GroupChatDetailPage,
})

function GroupChatDetailPage() {
  const { groupId, chatId } = Route.useParams()
  return <ChatDetailsPage groupId={groupId} chatId={chatId} />
}
