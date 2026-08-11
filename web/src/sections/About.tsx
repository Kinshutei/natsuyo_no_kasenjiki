import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { SITE } from '../site'

export function About() {
  return (
    <section className="section" id="about">
      <div className="section__inner">
        <SectionHead title="About" sub="このサイトについて" />
        <div className="about">
          <Reveal className="about__text">
            <p>{SITE.lead}</p>
            <p>
              歌枠のセットリストは配信アーカイブから手作業で記録しています。楽曲情報は
              RK Music系ファンサイトと共通のソングマスター（<code>rkmusic_song_master.json</code>）を
              参照しており、他サイトと同一の song_id で管理されています。
            </p>
            <p>
              本サイトは<strong>ファンによる非公式</strong>のデータベースです。ご本人・関係各所とは
              一切関係ありません。内容の誤りにお気づきの場合は、お手数ですが管理者までお知らせください。
            </p>
          </Reveal>
          <Reveal className="about__visual" delay={120}>
            VISUAL AREA<br />（素材差し替え予定）
          </Reveal>
        </div>
      </div>
    </section>
  )
}
