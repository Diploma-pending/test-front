import { createFileRoute, notFound } from "@tanstack/react-router"
import { ApiError, getGroupChats } from "@/shared/api/client"
import { GroupChatsListPage } from "@/pages/group-chats-list-page"

const GroupChatsListRoute = () => {
  const { groupId } = Route.useParams()
  return <GroupChatsListPage groupId={groupId} />
}

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
  component: GroupChatsListRoute,
})
