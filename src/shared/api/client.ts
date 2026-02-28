// Base API (no dependency on services to avoid circular imports)
export { ApiError, request } from "./base"

// Re-export feature services so existing imports from @/shared/api/client keep working
export {
  listBusinesses,
  listGroups,
  createGroup,
  triggerAnalysis,
  getGroupChats,
  getChatDetail,
  triggerChatAnalysis,
} from "./services"
