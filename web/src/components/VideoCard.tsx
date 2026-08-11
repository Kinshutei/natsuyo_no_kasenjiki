const TYPE_LABEL: Record<string, string> = {
  LiveArchive: 'LIVE',
  Movie: 'VIDEO',
  Short: 'SHORT',
}

export interface VideoCardProps {
  title: string
  date: string
  url: string
  thumbnail: string | null
  /** セトリ登録済みの枠のみ渡す。未登録の動画では出さない */
  songCount?: number
  firstCount?: number
  /** Short / Movie / LiveArchive */
  type?: string
}

/**
 * 動画1件のサムネカード。
 * 見た目はYouTubeの再生前サムネに寄せているが、クリックすると埋め込み再生ではなく
 * 当該動画のページへ遷移する。
 */
export function VideoCard({ title, date, url, thumbnail, songCount, firstCount, type }: VideoCardProps) {
  const inner = (
    <div className="card stream-card">
      <div className="thumb-wrap">
        {thumbnail
          ? <img className="thumb" src={thumbnail} alt="" loading="lazy" />
          : <div className="thumb thumb--empty">NO THUMBNAIL</div>}
        {url && (
          <span className="play-badge" aria-hidden="true">
            <span className="play-badge__icon" />
          </span>
        )}
        {type && TYPE_LABEL[type] && <span className="type-tag">{TYPE_LABEL[type]}</span>}
      </div>
      <div className="stream-card__body">
        <div className="stream-card__date">{date}</div>
        <div className="stream-card__title">{title}</div>
        <div className="stream-card__meta">
          {songCount === undefined
            ? <span className="stream-card__unlisted">セトリ未登録</span>
            : (
              <>
                {songCount} 曲
                {!!firstCount && <> ・ <span className="badge">初歌唱 {firstCount}</span></>}
              </>
            )}
        </div>
      </div>
    </div>
  )

  if (!url) return inner
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  )
}
