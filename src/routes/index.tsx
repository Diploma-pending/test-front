import { createFileRoute } from "@tanstack/react-router"
import { ChatsList } from "@/features/chats/ui/chat-list"

export const Route = createFileRoute("/")({
  component: ChatsList,
})

