import { createFileRoute } from "@tanstack/react-router"
import { GroupCreateForm } from "@/features/groups/ui/group-create-form"

export const Route = createFileRoute("/")({
  component: GroupCreatePage,
})

function GroupCreatePage() {
  return (
    <section className="flex flex-col gap-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create chat analysis group
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Choose a business context or upload a context file to generate AI
          support chats. After generation, run analysis to get quality scores
          and insights.
        </p>
      </header>
      <GroupCreateForm />
    </section>
  )
}
