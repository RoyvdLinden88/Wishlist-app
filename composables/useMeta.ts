import type { Category, CategoryMeta, Priority, Status, StatusMeta } from '~/types'

export const useMeta = () => {
  const categories: CategoryMeta[] = [
    { value: 'movie',       label: 'Film',          icon: '🎬', color: 'text-orange-400',  bg: 'bg-orange-500/15' },
    { value: 'series',      label: 'Serie',         icon: '📺', color: 'text-blue-400',    bg: 'bg-blue-500/15' },
    { value: 'documentary', label: 'Documentaire',  icon: '🎥', color: 'text-purple-400',  bg: 'bg-purple-500/15' },
    { value: 'book',        label: 'Boek',          icon: '📚', color: 'text-green-400',   bg: 'bg-green-500/15' },
    { value: 'music',       label: 'Muziek',        icon: '🎵', color: 'text-pink-400',    bg: 'bg-pink-500/15' },
    { value: 'restaurant',  label: 'Restaurant',    icon: '🍽️', color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
    { value: 'podcast',     label: 'Podcast',       icon: '🎙️', color: 'text-cyan-400',   bg: 'bg-cyan-500/15' },
    { value: 'game',        label: 'Spel',          icon: '🎮', color: 'text-red-400',     bg: 'bg-red-500/15' },
    { value: 'other',       label: 'Overig',        icon: '✨', color: 'text-slate-400',   bg: 'bg-slate-500/15' },
  ]

  const statuses: StatusMeta[] = [
    { value: 'want_to_check', label: 'Wil ik bekijken', color: 'text-blue-400',   bg: 'bg-blue-500/15',   dot: 'bg-blue-400' },
    { value: 'in_progress',   label: 'Bezig',          color: 'text-yellow-400', bg: 'bg-yellow-500/15', dot: 'bg-yellow-400' },
    { value: 'done',          label: 'Klaar',          color: 'text-green-400',  bg: 'bg-green-500/15',  dot: 'bg-green-400' },
  ]

  const priorities = [
    { value: 'low' as Priority,    label: 'Low',    color: 'text-slate-400',  bg: 'bg-slate-500/15' },
    { value: 'medium' as Priority, label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
    { value: 'high' as Priority,   label: 'High',   color: 'text-red-400',    bg: 'bg-red-500/15' },
  ]

  const getCategoryMeta = (value: Category): CategoryMeta =>
    categories.find(c => c.value === value) ?? categories[categories.length - 1]!

  const getStatusMeta = (value: Status): StatusMeta =>
    statuses.find(s => s.value === value) ?? statuses[0]!

  const getPriorityMeta = (value: Priority) =>
    priorities.find(p => p.value === value) ?? priorities[0]!

  return { categories, statuses, priorities, getCategoryMeta, getStatusMeta, getPriorityMeta }
}
