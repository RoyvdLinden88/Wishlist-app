import type { Category, CategoryMeta, Status, StatusMeta } from '~/types'

const LOCATION_CODES: Record<string, string> = {
  // Belgium
  brussel: 'be', brussels: 'be', antwerpen: 'be', antwerp: 'be',
  gent: 'be', brugge: 'be', bruges: 'be', luik: 'be', 'liège': 'be',
  'belgië': 'be', belgium: 'be',
  // Netherlands
  amsterdam: 'nl', rotterdam: 'nl', 'den haag': 'nl', 'the hague': 'nl',
  utrecht: 'nl', eindhoven: 'nl', nederland: 'nl', netherlands: 'nl',
  // France
  parijs: 'fr', paris: 'fr', lyon: 'fr', marseille: 'fr', nice: 'fr',
  bordeaux: 'fr', frankrijk: 'fr', france: 'fr',
  // UK
  londen: 'gb', london: 'gb', manchester: 'gb', edinburgh: 'gb',
  glasgow: 'gb', birmingham: 'gb', uk: 'gb', engeland: 'gb',
  // Germany
  berlijn: 'de', berlin: 'de', 'münchen': 'de', munich: 'de',
  hamburg: 'de', frankfurt: 'de', duitsland: 'de', germany: 'de',
  // Spain
  madrid: 'es', barcelona: 'es', sevilla: 'es', valencia: 'es',
  spanje: 'es', spain: 'es',
  // Italy
  rome: 'it', roma: 'it', milaan: 'it', milan: 'it',
  'venetië': 'it', venice: 'it', florence: 'it', napels: 'it',
  'italië': 'it', italy: 'it',
  // Portugal
  lissabon: 'pt', lisbon: 'pt', porto: 'pt', portugal: 'pt',
  // Austria
  wenen: 'at', wien: 'at', vienna: 'at', salzburg: 'at',
  oostenrijk: 'at', austria: 'at',
  // Switzerland
  'zürich': 'ch', 'genève': 'ch', zwitserland: 'ch', switzerland: 'ch',
  // Czech Republic
  praag: 'cz', prague: 'cz', 'tsjechië': 'cz',
  // Denmark
  kopenhagen: 'dk', copenhagen: 'dk', denemarken: 'dk',
  // Sweden
  stockholm: 'se', zweden: 'se', sweden: 'se',
  // Norway
  oslo: 'no', noorwegen: 'no', norway: 'no',
  // Finland
  helsinki: 'fi', finland: 'fi',
  // Ireland
  dublin: 'ie', ierland: 'ie', ireland: 'ie',
  // Poland
  warschau: 'pl', warsaw: 'pl', krakau: 'pl', poland: 'pl', polen: 'pl',
  // USA
  'new york': 'us', 'los angeles': 'us', chicago: 'us', miami: 'us',
  'san francisco': 'us', 'las vegas': 'us', usa: 'us', 'united states': 'us',
  // Japan
  tokyo: 'jp', osaka: 'jp', kyoto: 'jp', japan: 'jp',
  // China
  beijing: 'cn', shanghai: 'cn', china: 'cn',
  // South Korea
  seoul: 'kr', korea: 'kr',
  // Australia
  sydney: 'au', melbourne: 'au', 'australië': 'au', australia: 'au',
  // UAE
  dubai: 'ae', uae: 'ae',
  // Turkey
  istanbul: 'tr', turkije: 'tr', turkey: 'tr',
  // Thailand
  bangkok: 'th', thailand: 'th',
  // Singapore
  singapore: 'sg',
}

export const getLocationFlagUrl = (location: string): string | null => {
  const code = LOCATION_CODES[location.toLowerCase().trim()]
  return code ? `https://flagcdn.com/20x15/${code}.png` : null
}

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
      svgPath: 'M5 2v5a2 2 0 004 0V2M7 7v15M15 2v20M17 2a4 4 0 010 6',
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
    { value: 'want_to_check', label: 'Todo',  color: 'text-blue-400',  bg: 'bg-blue-500/15',  dot: 'bg-blue-400' },
    { value: 'done',          label: 'Klaar', color: 'text-green-400', bg: 'bg-green-500/15', dot: 'bg-green-400' },
  ]

  const getCategoryMeta = (value: Category): CategoryMeta =>
    categories.find(c => c.value === value) ?? categories[categories.length - 1]!

  const getStatusMeta = (value: Status): StatusMeta =>
    statuses.find(s => s.value === value) ?? statuses[0]!

  return { categories, statuses, getCategoryMeta, getStatusMeta }
}
