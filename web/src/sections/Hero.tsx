import { SITE } from '../site'

const ROMAJI = 'YAKON HIBANA'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__inner">
        <p className="hero__unofficial">UNOFFICIAL SETLIST DATABASE</p>

        {/* 日本語名の2×2ブロック幅に、ローマ字を均等割り付けする */}
        <div className="hero__name-block">
          <h1 className="hero__name">
            <span>夜紺</span>
            <span><em>火</em>花</span>
          </h1>
          <p className="hero__romaji" aria-label={ROMAJI}>
            {ROMAJI.split('').map((ch, i) =>
              ch === ' '
                ? <span key={i} className="hero__romaji-gap" aria-hidden="true" />
                : <span key={i} aria-hidden="true">{ch}</span>,
            )}
          </p>
        </div>

        <p className="hero__lead">{SITE.lead}</p>
        <p className="hero__scroll">SCROLL</p>
      </div>
    </section>
  )
}
