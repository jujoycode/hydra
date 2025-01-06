import { format, SqlLanguage } from 'sql-formatter'

export function formatQuery(query: string, language: SqlLanguage = 'postgresql'): string {
  return format(query, { language })
}
