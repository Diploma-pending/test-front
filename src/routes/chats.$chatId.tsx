import { createFileRoute } from "@tanstack/react-router"
import { ChatDetails } from "@/features/chats/ui/chat-details"

export const Route = createFileRoute("/chats/$chatId")({
  component: ChatDetails,
})

