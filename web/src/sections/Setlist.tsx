import { useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import type { StreamEntry, SungSong } from '../types'

function timeLabel(song: SungSong): string {
  const m = song.枠URL.match(/[?&]t=(\d+)/)
  if (!m) return ''
  const sec = parseInt(m[1], 10)
  const h = Math.floor(sec / 3600)
  const mi = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (v: number) => String(v).padStart(2, '0')
  return h > 0 ? `${h}:${pad(mi)}:${pad(s)}` : `${mi}:${pad(s)}`
}

export function Setlist({ streams }: { streams: StreamEntry[] }) {
  const [selected, setSelected] = useState(0)
  const current = streams[selected]

  return (
    <section className="section" id="setlist">
      <div className="section__inner">
        <SectionHead title="Setlist" sub="枠ごとの歌唱記録" />

        {streams.length === 0 ? (
          <Reveal><div className="empty-note">歌枠データはまだ登録されていません。</div></Reveal>
        ) : (
          <Reveal>
            <div className="setlist">
              <div className="setlist__list">
                {streams.map((s, i) => (
                  <button
                    key={s.key}
                    className={`setlist__item ${i === selected ? 'is-active' : ''}`}
                    onClick={() => setSelected(i)}
                  >
                    <div className="setlist__item-date">{s.配信日} ・ {s.songs.length}曲</div>
                    <div className="setlist__item-title">{s.枠名}</div>
                  </button>
                ))}
              </div>

              <div className="setlist__detail">
                {current && (
                  <>
                    <div className="setlist__detail-head">
                      {current.thumbnail && (
                        <img className="thumb" src={current.thumbnail} alt="" loading="lazy" />
                      )}
                      <div>
                        <h3 className="setlist__detail-title">{current.枠名}</h3>
                        <div className="stream-card__meta">
                          {current.配信日} ・ {current.songs.length}曲
                          {current.songs[0]?.コラボ相手様 !== 'なし' && ` ・ コラボ: ${current.songs[0]?.コラボ相手様}`}
                        </div>
                        {current.枠URL && (
                          <a className="songs__link" href={current.枠URL} target="_blank" rel="noopener noreferrer">
                            YouTube で開く →
                          </a>
                        )}
                      </div>
                    </div>

                    <table className="songs">
                      <thead>
                        <tr>
                          <th className="songs__no">NO</th>
                          <th>SONG</th>
                          <th>KEY</th>
                          <th>TIME</th>
                        </tr>
                      </thead>
                      <tbody>
                        {current.songs.map((song, i) => (
                          <tr key={`${song.song_id}_${i}`}>
                            <td className="songs__no">{song.歌唱順 || i + 1}</td>
                            <td>
                              <div className="songs__title">
                                {song.楽曲名} {song.初歌唱 && <span className="badge">初歌唱</span>}
                              </div>
                              <div className="songs__artist">
                                {song.原曲アーティスト}
                                {song.補足情報 && ` ／ ${song.補足情報}`}
                              </div>
                            </td>
                            <td className="songs__artist">{song.キー || '—'}</td>
                            <td>
                              {song.枠URL
                                ? <a className="songs__link" href={song.枠URL} target="_blank" rel="noopener noreferrer">{timeLabel(song) || '再生'}</a>
                                : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* 狭幅ではカード表示に切り替わる */}
                    <div className="songs-cards">
                      {current.songs.map((song, i) => (
                        <div className="song-card" key={`c_${song.song_id}_${i}`}>
                          <div className="song-card__head">
                            <span className="song-card__no">{song.歌唱順 || i + 1}</span>
                            <span className="song-card__title">{song.楽曲名}</span>
                            {song.初歌唱 && <span className="badge">初歌唱</span>}
                          </div>
                          <div className="song-card__meta">
                            {song.原曲アーティスト}
                            {song.キー && ` ／ キー ${song.キー}`}
                          </div>
                          {song.枠URL && (
                            <a className="songs__link" href={song.枠URL} target="_blank" rel="noopener noreferrer">
                              {timeLabel(song) || '再生'} →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
