import { useMemo, useState } from 'react'
import Plot from 'react-plotly.js'
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

const NAVY = '#16203a'
const SPARK = '#e8552f'

const LAYOUT_BASE = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { family: "'Hiragino Sans','Noto Sans JP',sans-serif", size: 11, color: NAVY },
  margin: { l: 60, r: 16, t: 16, b: 60 },
  showlegend: false,
} as const

const CONFIG = { displayModeBar: false, responsive: true } as const

/** 上位N件を [ラベル, 件数] で返す */
function topCounts(pairs: string[], n: number): { labels: string[]; values: number[] } {
  const map = new Map<string, number>()
  for (const p of pairs) {
    if (!p) continue
    map.set(p, (map.get(p) ?? 0) + 1)
  }
  const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, n)
  return { labels: sorted.map((x) => x[0]), values: sorted.map((x) => x[1]) }
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

  const ranking = useMemo(() => stats.slice(0, 20).reverse(), [stats])

  const yearDist = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of stats) {
      if (!s.リリース年) continue
      map.set(s.リリース年, (map.get(s.リリース年) ?? 0) + 1)
    }
    const labels = Array.from(map.keys()).sort()
    return { labels, values: labels.map((y) => map.get(y) ?? 0) }
  }, [stats])

  const artistDist = useMemo(
    () => topCounts(stats.map((s) => s.原曲アーティスト), 15),
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
            <div className="rep__bar">
              {tab === 'list' && (
                <input
                  className="rep__search"
                  type="search"
                  placeholder="楽曲名・原曲アーティストで検索"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              )}
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

            {tab === 'ranking' && (
              <div className="chart">
                <Plot
                  data={[{
                    type: 'bar',
                    orientation: 'h',
                    x: ranking.map((s) => s.歌唱回数),
                    y: ranking.map((s) => s.楽曲名),
                    marker: { color: SPARK },
                    hovertemplate: '%{y}<br>%{x} 回<extra></extra>',
                  }]}
                  layout={{ ...LAYOUT_BASE, height: Math.max(320, ranking.length * 26 + 60), margin: { l: 180, r: 16, t: 16, b: 40 } }}
                  config={CONFIG}
                  style={{ width: '100%' }}
                  useResizeHandler
                />
              </div>
            )}

            {tab === 'year' && (
              <div className="chart">
                <Plot
                  data={[{
                    type: 'bar',
                    x: yearDist.labels,
                    y: yearDist.values,
                    marker: { color: NAVY },
                    hovertemplate: '%{x}年<br>%{y} 曲<extra></extra>',
                  }]}
                  layout={{ ...LAYOUT_BASE, height: 400 }}
                  config={CONFIG}
                  style={{ width: '100%' }}
                  useResizeHandler
                />
              </div>
            )}

            {tab === 'artist' && (
              <div className="chart">
                <Plot
                  data={[{
                    type: 'bar',
                    orientation: 'h',
                    x: artistDist.values.slice().reverse(),
                    y: artistDist.labels.slice().reverse(),
                    marker: { color: NAVY },
                    hovertemplate: '%{y}<br>%{x} 曲<extra></extra>',
                  }]}
                  layout={{ ...LAYOUT_BASE, height: Math.max(320, artistDist.labels.length * 26 + 60), margin: { l: 160, r: 16, t: 16, b: 40 } }}
                  config={CONFIG}
                  style={{ width: '100%' }}
                  useResizeHandler
                />
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}
