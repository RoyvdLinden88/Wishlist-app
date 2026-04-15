import type { Category, CategoryMeta, Status, StatusMeta } from '~/types'

export const useMeta = () => {
  const categories: CategoryMeta[] = ([
    {
      value: 'book',
      label: 'Boek',
      svgPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'text-green-400',
      bg: 'bg-green-500/15',
    },
    {
      value: 'documentary',
      label: 'Documentaire',
      svgPath: 'M15 10l4.553-2.07A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z',
      color: 'text-purple-400',
      bg: 'bg-purple-500/15',
    },
    {
      value: 'restaurant',
      label: 'Eten & Drinken',
      svgPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/15',
    },
    {
      value: 'movie',
      label: 'Film',
      svgPath: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
      color: 'text-orange-400',
      bg: 'bg-orange-500/15',
    },
    {
      value: 'music',
      label: 'Muziek',
      svgPath: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
      color: 'text-pink-400',
      bg: 'bg-pink-500/15',
    },
    {
      value: 'other',
      label: 'Overig',
      svgPath: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z',
      color: 'text-slate-400',
      bg: 'bg-slate-500/15',
    },
    {
      value: 'podcast',
      label: 'Podcast',
      svgPath: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/15',
    },
    {
      value: 'series',
      label: 'Serie',
      svgPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      color: 'text-blue-400',
      bg: 'bg-blue-500/15',
    },
    {
      value: 'winkel',
      label: 'Winkel',
      svgPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      color: 'text-rose-400',
      bg: 'bg-rose-500/15',
    },
  ] as CategoryMeta[]).sort((a, b) => a.label.localeCompare(b.label, 'nl'))

  const statuses: StatusMeta[] = [
    { value: 'want_to_check', label: 'Wil ik bekijken', color: 'text-blue-400',   bg: 'bg-blue-500/15',   dot: 'bg-blue-400' },
    { value: 'in_progress',   label: 'Bezig',           color: 'text-yellow-400', bg: 'bg-yellow-500/15', dot: 'bg-yellow-400' },
    { value: 'done',          label: 'Klaar',           color: 'text-green-400',  bg: 'bg-green-500/15',  dot: 'bg-green-400' },
  ]

  const getCategoryMeta = (value: Category): CategoryMeta =>
    categories.find(c => c.value === value) ?? categories[categories.length - 1]!

  const getStatusMeta = (value: Status): StatusMeta =>
    statuses.find(s => s.value === value) ?? statuses[0]!

  return { categories, statuses, getCategoryMeta, getStatusMeta }
}
