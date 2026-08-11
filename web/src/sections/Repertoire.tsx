import { useMemo, useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import type { SongStat } from '../types'

type Tab = 'list' | 'ranking' | 'year' | 'artist'

const TABS: { id: Tab; label: string }[] = [
  { id: 'list', label: '楽曲一覧' },
  { id: 'ranking', label: '歌唱回数' },
  { id: 'year', label: 'リリース年' },
  { id: 'artist', label: '原曲アーティスト' },
]

const PER_PAGE = 10

interface CardItem {
  key: string
  /** 省略すると順位バッジを出さない */
  rank?: number
  title: string
  sub?: string
  value: number
  unit: string
}

/** キーごとに楽曲をまとめ、曲数の多い順に返す。同数のときは第2キーで安定させる */
function groupSongs(
  stats: SongStat[],
  key: (s: SongStat) => string,
  tieBreak: (a: string, b: string) => number,
): { label: string; songs: string[] }[] {
  const map = new Map<string, string[]>()
  for (const s of stats) {
    const k = key(s)
    if (!k) continue
    const arr = map.get(k)
    if (arr) arr.push(s.楽曲名)
    else map.set(k, [s.楽曲名])
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1].length - a[1].length || tieBreak(a[0], b[0]))
    .map(([label, songs]) => ({ label, songs }))
}

/** カード2行目に載せる曲名。多いときは先頭3曲＋残数 */
function summarize(songs: string[]): string {
  return songs.length <= 3
    ? songs.join(' ・ ')
    : `${songs.slice(0, 3).join(' ・ ')} 他${songs.length - 3}曲`
}

function Cards({ items }: { items: CardItem[] }) {
  if (items.length === 0) {
    return <div className="empty-note">該当するデータがありません。</div>
  }
  return (
    <div className="rank-grid">
      {items.map((item) => (
        <div
          className={`rank-card ${item.rank !== undefined && item.rank <= 3 ? 'rank-card--top' : ''}`}
          key={item.key}
        >
          {item.rank !== undefined && <span className="rank-card__no">{item.rank}</span>}
          <div className="rank-card__body">
            <div className="rank-card__title">{item.title}</div>
            {item.sub && <div className="rank-card__sub">{item.sub}</div>}
          </div>
          <div className="rank-card__value">
            {item.value}<span>{item.unit}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function Pager({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null
  return (
    <div className="pager">
      <button
        type="button"
        className="pager__btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="前のページ"
      >
        <span aria-hidden="true">◀</span>
      </button>
      <span className="pager__count">
        <strong>{page}</strong> / {total}
      </span>
      <button
        type="button"
        className="pager__btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= total}
        aria-label="次のページ"
      >
        <span aria-hidden="true">▶</span>
      </button>
    </div>
  )
}

export function Repertoire({ stats }: { stats: SongStat[] }) {
  const [tab, setTab] = useState<Tab>('list')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const changeTab = (t: Tab) => { setTab(t); setPage(1) }
  const changeQuery = (q: string) => { setQuery(q); setPage(1) }

  const songList = useMemo<CardItem[]>(() => {
    const q = query.trim().toLowerCase()
    const rows = q
      ? stats.filter((s) =>
          s.楽曲名.toLowerCase().includes(q) || s.原曲アーティスト.toLowerCase().includes(q))
      : stats
    return rows.map((s) => ({
      key: s.song_id,
      title: s.楽曲名,
      sub: [s.原曲アーティスト, s.リリース年 && `${s.リリース年}年`].filter(Boolean).join(' ・ '),
      value: s.歌唱回数,
      unit: '回',
    }))
  }, [stats, query])

  const ranking = useMemo<CardItem[]>(
    () => stats.map((s, i) => ({
      key: s.song_id,
      rank: i + 1,
      title: s.楽曲名,
      sub: s.原曲アーティスト,
      value: s.歌唱回数,
      unit: '回',
    })),
    [stats],
  )

  const yearDist = useMemo<CardItem[]>(
    // 曲数の多い年から並べる。同数なら新しい年を先に
    () => groupSongs(stats, (s) => s.リリース年, (a, b) => b.localeCompare(a))
      .map((y, i) => ({
        key: y.label,
        rank: i + 1,
        title: `${y.label}年`,
        sub: summarize(y.songs),
        value: y.songs.length,
        unit: '曲',
      })),
    [stats],
  )

  const artistDist = useMemo<CardItem[]>(
    () => groupSongs(stats, (s) => s.原曲アーティスト, (a, b) => a.localeCompare(b, 'ja'))
      .map((a, i) => ({
        key: a.label,
        rank: i + 1,
        title: a.label,
        sub: summarize(a.songs),
        value: a.songs.length,
        unit: '曲',
      })),
    [stats],
  )

  const items = tab === 'list' ? songList
    : tab === 'ranking' ? ranking
    : tab === 'year' ? yearDist
    : artistDist

  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const shown = items.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  return (
    <section className="section" id="repertoire">
      <div className="section__inner">
        <SectionHead title="Repertoire" sub="歌唱楽曲の統計" />

        {stats.length === 0 ? (
          <Reveal><div className="empty-note">歌枠データはまだ登録されていません。</div></Reveal>
        ) : (
          <Reveal>
            {/* タブを先に置き、検索フォームは右端。タブの位置がタブ切替で動かないようにする */}
            <div className="rep__bar">
              <div className="tabs">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    className={`tab-btn ${tab === t.id ? 'is-active' : ''}`}
                    onClick={() => changeTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {tab === 'list' && (
                <input
                  className="rep__search"
                  type="search"
                  placeholder="楽曲名・原曲アーティストで検索"
                  value={query}
                  onChange={(e) => changeQuery(e.target.value)}
                />
              )}
            </div>

            <Cards items={shown} />
            <Pager page={safePage} total={totalPages} onChange={setPage} />
          </Reveal>
        )}
      </div>
    </section>
  )
}
