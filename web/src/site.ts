/** サイト全体で使う固定情報 */
export const SITE = {
  name: '夜紺 火花',
  nameRomaji: 'YAKON HIBANA',
  title: '【非公式】夜紺 火花 DB',
  lead: 'ファンメイドの非公式データベース - 夜紺さんの歌枠のセトリ＆楽曲情報まとめ',
  links: [
    { label: 'YouTube', url: 'https://www.youtube.com/@YakonHibana' },
    { label: 'X', url: 'https://x.com/NIGHT_IS_NAVY' },
    { label: 'TikTok', url: 'https://www.tiktok.com/@yakon_hibana' },
  ],
} as const

export const NAV = [
  { id: 'numbers', label: 'NUMBERS' },
  { id: 'setlist', label: 'SETLIST' },
  { id: 'repertoire', label: 'REPERTOIRE' },
  { id: 'about', label: 'ABOUT' },
  { id: 'links', label: 'LINKS' },
] as const
