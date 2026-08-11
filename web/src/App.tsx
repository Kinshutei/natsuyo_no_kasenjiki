import { useEffect, useState } from 'react'
import { CityscapeFooter, VIEW_H } from './components/CityscapeFooter'
import { Header } from './components/Header'
import { ShootingStars } from './components/ShootingStars'
import { About } from './sections/About'
import { Hero } from './sections/Hero'
import { LatestStreams } from './sections/LatestStreams'
import { Links } from './sections/Links'
import { Numbers } from './sections/Numbers'
import { PickUp } from './sections/PickUp'
import { Repertoire } from './sections/Repertoire'
import { Setlist } from './sections/Setlist'
import { SITE } from './site'
import type { DbData } from './types'
import { loadDbData } from './utils/data'

const EMPTY: DbData = {
  streams: [], stats: [], contents: [], streamByVideoId: new Map(),
  総枠数: 0, 総歌唱数: 0, レパートリー数: 0,
}

/** 街並みの描画倍率。固定フッターの高さもこれで決まる（global.css の --footer-h と揃える） */
const CITY_SCALE = 0.5
const FOOTER_H = Math.round(VIEW_H * CITY_SCALE)

export default function App() {
  const [data, setData] = useState<DbData>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  // 流星群は既定でOFF。ヘッダーのトグルで切り替える
  const [meteorsOn, setMeteorsOn] = useState(false)

  useEffect(() => {
    loadDbData()
      .then(setData)
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <>
      {meteorsOn && <ShootingStars />}
      <Header meteorsOn={meteorsOn} onToggleMeteors={() => setMeteorsOn((v) => !v)} />

      <div className="page">
        <Hero />

        {error && (
          <section className="section">
            <div className="section__inner">
              <div className="empty-note">データの読み込みに失敗しました：{error}</div>
            </div>
          </section>
        )}

        <LatestStreams
          contents={data.contents}
          streams={data.streams}
          streamByVideoId={data.streamByVideoId}
        />
        <PickUp streams={data.streams} />
        <Numbers data={data} />
        <Setlist streams={data.streams} />
        <Repertoire stats={data.stats} />
        <About />
        <Links />

        <div className="site-note">
          <strong>{SITE.title}</strong><br />
          本サイトはファンによる非公式のデータベースです。ご本人および関係各所とは一切関係ありません。<br />
          楽曲情報は RK Music系ファンサイト共通のソングマスターを参照しています。
        </div>
      </div>

      <div className="city-fixed" style={{ height: FOOTER_H }}>
        <CityscapeFooter
          className="cityscape--yako"
          scale={CITY_SCALE}
          seed={20260811}
          speed={10}
          districtScale={0.8}
        />
      </div>
    </>
  )
}
