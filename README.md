# 【非公式】夜紺 火花 DB

個人勢VSinger **夜紺 火花 / Yakon Hibana** さんの歌枠セットリスト・楽曲データをまとめた、
ファンメイドの非公式データベースサイトです。GitHub Pages でホストされています。

> 本サイトはファンによる非公式のものです。ご本人および関係各所とは一切関係ありません。

## 構成

```
natsuyo_no_kasenjiki/
├── .github/workflows/
│   ├── pages.yml                   # 自動ビルド・デプロイ
│   └── fetch_contents.yml          # チャンネル最新投稿の日次取得
├── fetch_contents.py               # YouTube Data API で最新投稿を取得
├── requirements.txt
├── rkmusic_song_master.json        # 楽曲マスター（RK Music系ファンサイトと共通）
├── streaminginfo_Yako.json         # 歌枠・歌唱記録
├── yako_contents.json              # チャンネル最新投稿（自動生成）
└── web/                            # React 18 + TypeScript + Vite
    ├── index.html
    ├── vite.config.ts              # base: '/natsuyo_no_kasenjiki/'
    └── src/
        ├── App.tsx                 # 1ページ縦スクロールの全体構成
        ├── site.ts                 # 名義・公式リンク等の固定情報
        ├── types.ts
        ├── styles/global.css
        ├── utils/data.ts           # JSON取得・マスターJOIN・集計
        ├── hooks/useReveal.ts      # スクロール連動表示 / カウントアップ
        ├── components/
        │   └── CityscapeFooter/    # プロシージャル生成の街並みフッター
        └── sections/               # 各セクション
```

## 画面構成

タブ切り替えではなく、1ページを縦にスクロールしてコンテンツを辿る構成です。

| セクション | 内容 |
|---|---|
| Hero | 全画面のファーストビュー |
| Latest | チャンネルの最新投稿を横スクロールで表示（セトリ登録済みの枠には曲数バッジ） |
| Pick Up | 初歌唱を多く含む枠を3件 |
| About | サイト概要 |
| Numbers | 総枠数 / 総歌唱数 / レパートリー数 / 初歌唱数のカウントアップ |
| Setlist | 左に枠リスト（sticky）、右にセットリストの2カラム |
| Repertoire | 楽曲一覧・検索／歌唱回数・リリース年・原曲アーティストのグラフ |
| Official Links | YouTube / X / TikTok |

固定フッターには、シード固定の疑似乱数で生成した線画の街並みが横方向にループスクロールします。
実装仕様は `web/src/components/CityscapeFooter/` を参照してください。

## チャンネル最新投稿の自動取得

`fetch_contents.py` が YouTube Data API v3 でチャンネル
（`UCgKjo_iSJpFmXQypArDztYA`）の最新12件を取得し、`yako_contents.json` を更新します。
`.github/workflows/fetch_contents.yml` が **毎日 JST 0:00** に実行し、差分があればコミット＆プッシュ、
それを検知して Pages が再ビルドされます。手動実行（`workflow_dispatch`）も可能です。

- APIキーはリポジトリSecret `YOUTUBE_API_KEY` に設定してください（`RKMusic_AllSinger_PFR` と同じキーを流用）
- 消費クォータは1実行あたり3unit（無料枠10,000/日）
- Latest セクションは `yako_contents.json` を表示し、`streaminginfo_Yako.json` に
  同じ動画IDの枠があれば曲数・初歌唱バッジを添えます。未登録の動画は「セトリ未登録」と表示されます
- `yako_contents.json` が空（＝ワークフロー未実行）の場合は、登録済みの枠一覧にフォールバックします

### yako_contents.json

| キー | 説明 |
|---|---|
| video_id | YouTube動画ID |
| title | タイトル |
| published_at | 配信開始時刻（`actualStartTime`。通常動画は公開日時） |
| duration_sec | 再生時間（秒） |
| type | `Short`（60秒以下）/ `LiveArchive`（配信）/ `Movie` |

## データ更新

**「RKMusic_統合管理ツール」の JSON Manager タブ → 「夜紺」** から追加・編集し、
GitHub へ直接プッシュします。`main` への push を検知して GitHub Actions が自動でビルド・デプロイします。

### streaminginfo_Yako.json

| キー | 説明 |
|---|---|
| 枠名 | 配信タイトル |
| song_id | 楽曲マスターとの紐付けキー |
| 補足情報 | 備考 |
| 歌唱順 | 枠内での順番 |
| 配信日 | YYYY-MM-DD |
| 枠URL | YouTube URL（`?t=秒数` 付きで頭出しになる） |
| 曲終了時間 | `H:MM:SS` |
| コラボ相手様 | コラボなしの場合は「なし」 |
| キー | 歌唱キー |

### rkmusic_song_master.json

`song_id` / `楽曲名` / `原曲アーティスト` / `作詞1` `作詞2` / `作曲1` `作曲2` / `編曲1` `編曲2` / `リリース日`

RK Music系ファンサイト（深影DB・Diα DB 等）と**共通のマスター**です。
統合管理ツールの「全DBへプッシュ」で、登録済み全リポジトリへ同一内容が配信されます。

## ローカル開発

```bash
cd web
npm install
npm run dev
```

データJSONはリポジトリ直下にあり `web/` の外にあるため、開発時のみ `vite.config.ts` の
ミドルウェアが `/data/*.json` として配信します。本番では `pages.yml` が
`VITE_CSV_URL` / `VITE_MASTER_URL` に raw.githubusercontent の URL を注入します。

## 技術スタック

| 項目 | 内容 |
|---|---|
| フレームワーク | React 18 + TypeScript |
| ビルド | Vite 5 |
| グラフ | Plotly.js |
| スタイル | プレーンCSS（フレームワーク不使用） |
| デプロイ | GitHub Pages（GitHub Actions） |
