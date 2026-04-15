export type ThemeName = 'cobalt' | 'nacht' | 'bos' | 'zonsondergang' | 'roos'

export interface ThemeDef {
  name: ThemeName
  label: string
  accent: string   // hex swatch color
}

export const THEMES: ThemeDef[] = [
  { name: 'cobalt',        label: 'Cobalt',        accent: '#5b6cf8' },
  { name: 'nacht',         label: 'Nacht',         accent: '#8b5cf6' },
  { name: 'bos',           label: 'Bos',           accent: '#10b981' },
  { name: 'zonsondergang', label: 'Zonsondergang', accent: '#f59e0b' },
  { name: 'roos',          label: 'Roos',          accent: '#f43f5e' },
]

type Vars = Record<string, string>

// All themes are light — subtle tinted canvas + white cards + dark text
const THEME_VARS: Record<ThemeName, Vars> = {
  cobalt: {
    '--canvas':    '244 244 252',
    '--card':      '255 255 255',
    '--inset':     '235 235 250',
    '--ink':       '17 17 30',
    '--brand-300': '157 180 255',
    '--brand-500': '91 108 248',
    '--brand-600': '74 82 237',
  },
  nacht: {
    '--canvas':    '247 244 252',
    '--card':      '255 255 255',
    '--inset':     '238 233 252',
    '--ink':       '22 14 35',
    '--brand-300': '196 181 253',
    '--brand-500': '139 92 246',
    '--brand-600': '124 58 237',
  },
  bos: {
    '--canvas':    '242 251 246',
    '--card':      '255 255 255',
    '--inset':     '228 248 238',
    '--ink':       '14 25 18',
    '--brand-300': '110 231 183',
    '--brand-500': '16 185 129',
    '--brand-600': '5 150 105',
  },
  zonsondergang: {
    '--canvas':    '252 248 240',
    '--card':      '255 255 255',
    '--inset':     '252 242 222',
    '--ink':       '28 20 8',
    '--brand-300': '252 211 77',
    '--brand-500': '245 158 11',
    '--brand-600': '217 119 6',
  },
  roos: {
    '--canvas':    '252 243 246',
    '--card':      '255 255 255',
    '--inset':     '252 232 240',
    '--ink':       '28 10 18',
    '--brand-300': '253 164 175',
    '--brand-500': '244 63 94',
    '--brand-600': '225 29 72',
  },
}

const VALID = new Set<string>(THEMES.map(t => t.name))

function applyVars(theme: ThemeName) {
  if (!import.meta.client) return
  const vars = THEME_VARS[theme]
  const root = document.documentElement
  for (const [prop, value] of Object.entries(vars)) {
    root.style.setProperty(prop, value)
  }
}

export const useTheme = () => {
  const route = useRoute()
  const router = useRouter()

  const currentTheme = computed<ThemeName>(() => {
    const q = route.query.theme as string
    return (VALID.has(q) ? q : 'cobalt') as ThemeName
  })

  const setTheme = (theme: ThemeName) => {
    router.push({ query: { ...route.query, theme } })
  }

  watch(currentTheme, applyVars, { immediate: true })

  onMounted(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('theme') ?? ''
    applyVars((VALID.has(q) ? q : 'cobalt') as ThemeName)
  })

  return { currentTheme, setTheme }
}
