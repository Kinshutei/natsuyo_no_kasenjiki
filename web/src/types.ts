// ─────────────────────────────────────────
// 生JSON（rkmusic_song_master.json / streaminginfo_Yako.json）
// 統合管理ツールが書き出す形式に合わせ、全フィールドが string
// ─────────────────────────────────────────
export interface SongMasterRow {
  song_id: string
  楽曲名: string
  原曲アーティスト: string
  作詞1: string
  作詞2: string
  作曲1: string
  作曲2: string
  編曲1: string
  編曲2: string
  リリース日: string
}

export interface StreamingRow {
  枠名: string
  song_id: string
  補足情報: string
  歌唱順: string
  配信日: string
  枠URL: string
  曲終了時間: string
  コラボ相手様: string
  キー: string
}

// ─────────────────────────────────────────
// マスターをJOINした1歌唱
// ─────────────────────────────────────────
export interface SungSong {
  song_id: string
  楽曲名: string
  原曲アーティスト: string
  作詞: string
  作曲: string
  編曲: string
  リリース日: string
  リリース年: string
  補足情報: string
  歌唱順: number
  配信日: string
  枠URL: string
  曲終了時間: string
  コラボ相手様: string
  キー: string
  /** その曲がこの枠で初めて歌われたか */
  初歌唱: boolean
}

/** 1配信枠 */
export interface StreamEntry {
  key: string
  枠名: string
  配信日: string
  videoId: string | null
  thumbnail: string | null
  枠URL: string
  songs: SungSong[]
}

/** 楽曲単位の集計 */
export interface SongStat {
  song_id: string
  楽曲名: string
  原曲アーティスト: string
  作詞: string
  作曲: string
  リリース日: string
  リリース年: string
  歌唱回数: number
  初歌唱日: string
  最終歌唱日: string
}

/** チャンネルから自動取得した投稿1件（yako_contents.json） */
export interface ContentVideo {
  video_id: string
  title: string
  published_at: string
  duration_sec: number
  type: 'Short' | 'Movie' | 'LiveArchive'
}

export interface DbData {
  streams: StreamEntry[]
  stats: SongStat[]
  /** チャンネルの最新投稿。取得できなければ空 */
  contents: ContentVideo[]
  /** 動画IDから登録済みの枠を引く。Latestで曲数バッジを出すために使う */
  streamByVideoId: Map<string, StreamEntry>
  総枠数: number
  総歌唱数: number
  レパートリー数: number
}
