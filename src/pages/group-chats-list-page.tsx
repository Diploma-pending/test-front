import { GroupChatsList } from "@/features/groups/ui/group-chats-list"

type GroupChatsListPageProps = {
  groupId: string
}

export const GroupChatsListPage = ({ groupId }: GroupChatsListPageProps) => (
  <GroupChatsList groupId={groupId} />
)
