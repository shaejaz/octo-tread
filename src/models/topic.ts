export interface Topic {
  name: string
  display_name: string | null
  short_description: string | null
  description: string | null
  created_by: string | null
  released: string | null
  created_at: string
  updated_at: string
  featured: boolean
  curated: boolean
  score: number
  repository_count?: number | null
  logo_url?: string | null
  related?:
    | {
        topic_relation?: {
          id?: number
          name?: string
          topic_id?: number
          relation_type?: string
          [k: string]: unknown
        }
        [k: string]: unknown
      }[]
    | null
  aliases?:
    | {
        topic_relation?: {
          id?: number
          name?: string
          topic_id?: number
          relation_type?: string
          [k: string]: unknown
        }
        [k: string]: unknown
      }[]
    | null
}
