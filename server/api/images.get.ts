interface ImageResult {
  url: string
  label: string
}

function dedup(results: ImageResult[]): ImageResult[] {
  const seen = new Set<string>()
  return results.filter(r => {
    if (!r.url || seen.has(r.url)) return false
    seen.add(r.url)
    return true
  })
}

export default defineEventHandler(async (event): Promise<ImageResult[]> => {
  const { query, category, includeWeb } = getQuery(event) as {
    query?: string
    category?: string
    includeWeb?: string
  }

  if (!query?.trim() || !category) return []

  const config = useRuntimeConfig()
  const q = encodeURIComponent(query.trim())

  const fetches: Promise<ImageResult[]>[] = []

  if (category === 'movie') {
    fetches.push(
      $fetch<any>(`https://api.themoviedb.org/3/search/movie?query=${q}&api_key=${config.tmdbApiKey}&language=nl-NL&page=1`)
        .then(data => (data.results ?? []).filter((r: any) => r.poster_path).slice(0, 10).map((r: any) => ({
          url: `https://image.tmdb.org/t/p/w300${r.poster_path}`,
          label: r.title ?? '',
        })))
        .catch(() => []),
    )
  }

  if (category === 'series' || category === 'documentary') {
    fetches.push(
      $fetch<any>(`https://api.themoviedb.org/3/search/tv?query=${q}&api_key=${config.tmdbApiKey}&language=nl-NL&page=1`)
        .then(data => (data.results ?? []).filter((r: any) => r.poster_path).slice(0, 10).map((r: any) => ({
          url: `https://image.tmdb.org/t/p/w300${r.poster_path}`,
          label: r.name ?? '',
        })))
        .catch(() => []),
    )
  }

  if (category === 'book') {
    fetches.push(
      $fetch<any>(`https://openlibrary.org/search.json?title=${q}&limit=12&fields=title,cover_i`)
        .then(data => (data.docs ?? []).filter((d: any) => d.cover_i).slice(0, 10).map((d: any) => ({
          url: `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`,
          label: d.title ?? '',
        })))
        .catch(() => []),
    )
  }

  if (category === 'music') {
    fetches.push(
      $fetch<any>(`https://api.deezer.com/search?q=${q}&limit=20`)
        .then((data) => {
          const seen = new Set<string>()
          return (data.data ?? []).filter((r: any) => {
            const cover = r.album?.cover_medium
            if (!cover || seen.has(cover)) return false
            seen.add(cover)
            return true
          }).slice(0, 10).map((r: any) => ({
            url: r.album.cover_medium,
            label: r.album.title ?? '',
          }))
        })
        .catch(() => []),
    )
  }

  if (category === 'podcast') {
    fetches.push(
      $fetch<any>(`https://itunes.apple.com/search?term=${q}&media=podcast&entity=podcast&limit=10`)
        .then(data => (data.results ?? []).filter((r: any) => r.artworkUrl600).map((r: any) => ({
          url: r.artworkUrl600,
          label: r.trackName ?? '',
        })))
        .catch(() => []),
    )
  }

  // SerpApi (Google Images) — only when explicitly requested by the user
  if (includeWeb === 'true' && config.serpApiKey) {
    fetches.push(
      $fetch<any>(`https://serpapi.com/search.json?q=${q}&tbm=isch&api_key=${config.serpApiKey}&num=20&safe=active`)
        .then(data => (data.images_results ?? []).slice(0, 20).map((r: any) => ({
          url: r.original ?? r.thumbnail,
          label: r.title ?? '',
        })))
        .catch(() => []),
    )
  }

  const all = await Promise.all(fetches)
  return dedup(all.flat()).slice(0, 50)
})
