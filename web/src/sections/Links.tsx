import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { SITE } from '../site'

export function Links() {
  return (
    <section className="section" id="links">
      <div className="section__inner">
        <SectionHead title="Official Links" sub="ご本人の公式アカウント" />
        <Reveal>
          <div className="links">
            {SITE.links.map((l) => (
              <a
                key={l.label}
                className="link-btn"
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
