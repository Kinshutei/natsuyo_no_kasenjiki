import { SectionHead } from '../components/SectionHead'
import { useCountUp, useInView } from '../hooks/useReveal'
import type { DbData } from '../types'

function NumberCell({ value, label, unit, delay }: { value: number; label: string; unit: string; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const n = useCountUp(value, inView)
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      <div className="number__value">{n.toLocaleString('ja-JP')}<em>{unit}</em></div>
      <div className="number__label">{label}</div>
    </div>
  )
}

export function Numbers({ data }: { data: DbData }) {
  const 初歌唱数 = data.streams.reduce((n, s) => n + s.songs.filter((x) => x.初歌唱).length, 0)

  return (
    <section className="section" id="numbers">
      <div className="section__inner">
        <SectionHead title="Numbers" sub="収録データの規模" />
        <div className="numbers">
          <NumberCell value={data.総枠数} label="STREAMS" unit="枠" delay={0} />
          <NumberCell value={data.総歌唱数} label="PERFORMANCES" unit="回" delay={80} />
          <NumberCell value={data.レパートリー数} label="REPERTOIRE" unit="曲" delay={160} />
          <NumberCell value={初歌唱数} label="FIRST TIME" unit="曲" delay={240} />
        </div>
      </div>
    </section>
  )
}
