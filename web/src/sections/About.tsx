import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'

export function About() {
  return (
    <section className="section" id="about">
      <div className="section__inner">
        <SectionHead title="About" sub="このサイトについて" />
        <div className="about">
          <Reveal className="about__text">
            <p>FanMadeの非公式データベースです。</p>
            <p>
              夜紺火花さんの歌枠にて、どのような曲が歌われたのか、
              またはどのようなアーティストの曲が多いのかをまとめたデータベースです。
            </p>
            <p>
              また制作者は私・白百合と金鷲亭によるものです。
              非公式DBとなりますので、お気づきの点やご不明点は夜紺火花さんにではなく、私宛にご連絡ください。
            </p>
          </Reveal>
          <Reveal className="about__visual" delay={120}>
            <img
              className="about__logo"
              src={`${import.meta.env.BASE_URL}viju.png`}
              alt="「戦史」同人サークル 白百合と金鷲亭の紋章"
              loading="lazy"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
