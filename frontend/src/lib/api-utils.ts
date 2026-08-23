export function extractListResults<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === "object" && "results" in data) {
    const results = (data as { results?: T[] }).results
    return Array.isArray(results) ? results : []
  }
  return []
}

export async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<{ data: unknown }>
): Promise<T[]> {
  const items: T[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const { data } = await fetchPage(page)
    const batch = extractListResults<T>(data)
    items.push(...batch)

    if (data && typeof data === "object" && "next" in data) {
      hasMore = Boolean((data as { next?: string | null }).next)
      page += 1
      continue
    }

    hasMore = false
  }

  return items
}
