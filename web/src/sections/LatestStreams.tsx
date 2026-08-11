import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'
import { VideoCard } from '../components/VideoCard'
import type { ContentVideo, StreamEntry } from '../types'
import { toJstDate } from '../utils/data'

interface Props {
  contents: ContentVideo[]
  streams: StreamEntry[]
  streamByVideoId: Map<string, StreamEntry>
}

/**
 * チャンネルの最新投稿を並べる。セトリ登録済みの枠は曲数バッジを添える。
 * yako_contents.json がまだ無い場合は、登録済みの枠だけを表示する。
 */
export function LatestStreams({ contents, streams, streamByVideoId }: Props) {
  const hasContents = contents.length > 0
  const items = hasContents
    ? contents.slice(0, 12).map((c) => {
        const s = streamByVideoId.get(c.video_id)
        return {
          key: c.video_id,
          title: c.title,
          date: toJstDate(c.published_at),
          url: `https://www.youtube.com/watch?v=${c.video_id}`,
          thumbnail: `https://i.ytimg.com/vi/${c.video_id}/hqdefault.jpg`,
          type: c.type,
          songCount: s ? s.songs.length : undefined,
          firstCount: s ? s.songs.filter((x) => x.初歌唱).length : undefined,
        }
      })
    : streams.slice(0, 12).map((s) => ({
        key: s.key,
        title: s.枠名,
        date: s.配信日,
        url: s.枠URL,
        thumbnail: s.thumbnail,
        type: undefined,
        songCount: s.songs.length,
        firstCount: s.songs.filter((x) => x.初歌唱).length,
      }))

  return (
    <section className="section" id="latest">
      <div className="section__inner">
        <SectionHead title="Latest" sub={hasContents ? 'チャンネルの最新投稿' : '直近の歌枠'} />
        {items.length === 0 ? (
          <Reveal><div className="empty-note">まだデータが登録されていません。</div></Reveal>
        ) : (
          <Reveal>
            <div className="rail">
              {items.map(({ key, ...card }) => <VideoCard key={key} {...card} />)}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
