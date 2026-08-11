import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { VideoCard } from '../components/VideoCard'
import type { StreamEntry } from '../types'

/** 初歌唱を多く含む枠を「見どころ」として3件拾う */
export function PickUp({ streams }: { streams: StreamEntry[] }) {
  const picks = [...streams]
    .map((s) => ({ s, n: s.songs.filter((x) => x.初歌唱).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n || b.s.配信日.localeCompare(a.s.配信日))
    .slice(0, 3)

  if (picks.length === 0) return null

  return (
    <section className="section" id="pickup">
      <div className="section__inner">
        <SectionHead title="Pick Up" sub="初歌唱が多く収録された枠" />
        <div className="grid-3">
          {picks.map(({ s, n }, i) => (
            <Reveal key={s.key} delay={i * 90}>
              <VideoCard
                title={s.枠名}
                date={s.配信日}
                url={s.枠URL}
                thumbnail={s.thumbnail}
                songCount={s.songs.length}
                firstCount={n}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
