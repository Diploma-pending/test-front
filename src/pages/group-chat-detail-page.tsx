import { ChatDetailsPage } from "@/features/chats/ui/chat-details"

type GroupChatDetailPageProps = {
  groupId: string
  chatId: string
}

export const GroupChatDetailPage = ({
  groupId,
  chatId,
}: GroupChatDetailPageProps) => <ChatDetailsPage groupId={groupId} chatId={chatId} />
