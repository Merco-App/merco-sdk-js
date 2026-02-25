/**
 * User directory and admin types
 */

export interface UserProfileData {
  id: string
  email?: string
  username?: string
  display_name?: string
  created_at?: string
  is_active?: boolean
}

export interface SessionData {
  id: string
  created_at?: string
  last_accessed_at?: string
  user_agent?: string
}
