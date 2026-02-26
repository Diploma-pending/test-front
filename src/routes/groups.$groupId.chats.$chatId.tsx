import { createFileRoute } from "@tanstack/react-router"
import { ChatDetailsPage } from "@/features/chats/ui/chat-details"

export const Route = createFileRoute("/groups/$groupId/chats/$chatId")({
  component: GroupChatDetailPage,
})

function GroupChatDetailPage() {
  const { groupId, chatId } = Route.useParams()
  return <ChatDetailsPage groupId={groupId} chatId={chatId} />
}
