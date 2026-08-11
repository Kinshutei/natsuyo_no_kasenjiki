import { Suspense, lazy, useMemo, useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import type { SongStat } from '../types'

// Plotly は重いため、グラフのタブが押されたときに初めて読み込む
const Chart = lazy(() => import('../components/Chart'))

function ChartFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="chart">
      <Suspense fallback={<div className="chart__loading">グラフを読み込んでいます…</div>}>
        {children}
      </Suspense>
    </div>
  )
}

type Tab = 'list' | 'ranking' | 'year' | 'artist'

const TABS: { id: Tab; label: string }[] = [
  { id: 'list', label: '楽曲一覧' },
  { id: 'ranking', label: '歌唱回数' },
  { id: 'year', label: 'リリース年' },
  { id: 'artist', label: '原曲アーティスト' },
]

/** リリース年グラフの棒色。グレー寄りのブルー */
const STEEL = '#7d93b5'

const RANK_LIMIT = 10

interface RankItem {
  key: string
  title: string
  sub: string
  value: number
  unit: string
}

/** 上位N件を件数の多い順に返す */
function topCounts(values: string[], n: number): { label: string; count: number }[] {
  const map = new Map<string, number>()
  for (const v of values) {
    if (!v) continue
    map.set(v, (map.get(v) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ja'))
    .slice(0, n)
    .map(([label, count]) => ({ label, count }))
}

/** 順位カード。上位3件は番号を火花の朱で強調する */
function RankCards({ items }: { items: RankItem[] }) {
  if (items.length === 0) {
    return <div className="empty-note">集計できるデータがありません。</div>
  }
  return (
    <div className="rank-grid">
      {items.map((item, i) => (
        <div className={`rank-card ${i < 3 ? 'rank-card--top' : ''}`} key={item.key}>
          <span className="rank-card__no">{i + 1}</span>
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

export function Repertoire({ stats }: { stats: SongStat[] }) {
  const [tab, setTab] = useState<Tab>('list')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return stats
    return stats.filter(
      (s) => s.楽曲名.toLowerCase().includes(q) || s.原曲アーティスト.toLowerCase().includes(q),
    )
  }, [stats, query])

  const ranking = useMemo<RankItem[]>(
    () => stats.slice(0, RANK_LIMIT).map((s) => ({
      key: s.song_id,
      title: s.楽曲名,
      sub: s.原曲アーティスト,
      value: s.歌唱回数,
      unit: '回',
    })),
    [stats],
  )

  const yearDist = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of stats) {
      if (!s.リリース年) continue
      map.set(s.リリース年, (map.get(s.リリース年) ?? 0) + 1)
    }
    const labels = Array.from(map.keys()).sort()
    return { labels, values: labels.map((y) => map.get(y) ?? 0) }
  }, [stats])

  const artistDist = useMemo<RankItem[]>(
    () => topCounts(stats.map((s) => s.原曲アーティスト), RANK_LIMIT).map((a) => ({
      key: a.label,
      title: a.label,
      sub: '',
      value: a.count,
      unit: '曲',
    })),
    [stats],
  )

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
                    onClick={() => setTab(t.id)}
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
                  onChange={(e) => setQuery(e.target.value)}
                />
              )}
            </div>

            {tab === 'list' && (
              <div className="rep__table-wrap fancy-scroll">
                <table className="rep__table">
                  <thead>
                    <tr>
                      <th>SONG</th>
                      <th>ARTIST</th>
                      <th>RELEASE</th>
                      <th>COUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.song_id}>
                        <td className="songs__title">{s.楽曲名}</td>
                        <td className="songs__artist">{s.原曲アーティスト || '—'}</td>
                        <td className="songs__artist">{s.リリース年 || '—'}</td>
                        <td className="rep__count">{s.歌唱回数}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={4} className="songs__artist">該当する楽曲がありません。</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'ranking' && <RankCards items={ranking} />}

            {tab === 'year' && (
              <ChartFrame>
                <Chart
                  data={[{
                    type: 'bar',
                    x: yearDist.labels,
                    y: yearDist.values,
                    marker: { color: STEEL },
                    hovertemplate: '%{x}年<br>%{y} 曲<extra></extra>',
                  }]}
                  height={434}
                />
              </ChartFrame>
            )}

            {tab === 'artist' && <RankCards items={artistDist} />}
          </Reveal>
        )}
      </div>
    </section>
  )
}
