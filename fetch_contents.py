#!/usr/bin/env python3
"""
夜紺 火花さんのYouTubeチャンネルから最新の投稿を取得し、yako_contents.json を更新する。

GitHub Actions から1日1回実行される想定。
消費クォータは1実行あたり3unit（channels 1 + playlistItems 1 + videos 1）。
"""
import json
import os
import sys
from pathlib import Path

import isodate
from googleapiclient.discovery import build

CHANNEL_ID = 'UCgKjo_iSJpFmXQypArDztYA'  # 夜紺 火花 / Yakon Hibana
MAX_ITEMS = 12
SHORT_MAX_SEC = 60
OUTPUT = Path(__file__).parent / 'yako_contents.json'


def classify(duration_sec: int, is_live: bool) -> str:
    """Short / LiveArchive / Movie に分類する。

    liveStreamingDetails の有無で配信かどうかを判定できるため、
    ここでは時間のみの判定ではなく配信情報を優先する。
    """
    if 0 < duration_sec <= SHORT_MAX_SEC:
        return 'Short'
    if is_live:
        return 'LiveArchive'
    return 'Movie'


def main() -> int:
    api_key = os.environ.get('YOUTUBE_API_KEY')
    if not api_key:
        print('❌ エラー: YOUTUBE_API_KEY が設定されていません', file=sys.stderr)
        return 1

    youtube = build('youtube', 'v3', developerKey=api_key)

    # アップロード済み動画のプレイリストIDを取得
    channels = youtube.channels().list(part='contentDetails', id=CHANNEL_ID).execute()
    items = channels.get('items') or []
    if not items:
        print(f'❌ チャンネルが見つかりません: {CHANNEL_ID}', file=sys.stderr)
        return 1
    uploads = items[0]['contentDetails']['relatedPlaylists']['uploads']

    # 最新の動画IDを新しい順に取得
    playlist = youtube.playlistItems().list(
        part='contentDetails', playlistId=uploads, maxResults=MAX_ITEMS,
    ).execute()
    video_ids = [i['contentDetails']['videoId'] for i in playlist.get('items', [])]
    if not video_ids:
        print('⚠️ 動画が見つかりませんでした')
        OUTPUT.write_text('[]\n', encoding='utf-8')
        return 0

    # 再生時間・配信情報を補完
    videos = youtube.videos().list(
        part='snippet,contentDetails,liveStreamingDetails', id=','.join(video_ids),
    ).execute()
    by_id = {v['id']: v for v in videos.get('items', [])}

    entries = []
    for vid in video_ids:
        v = by_id.get(vid)
        if not v:
            continue
        snippet = v['snippet']
        live = v.get('liveStreamingDetails') or {}
        try:
            duration = int(isodate.parse_duration(v['contentDetails']['duration']).total_seconds())
        except Exception:
            duration = 0
        entries.append({
            'video_id': vid,
            'title': snippet['title'],
            # 配信は公開日時ではなく実際の開始時刻を配信日として扱う
            'published_at': live.get('actualStartTime') or snippet['publishedAt'],
            'duration_sec': duration,
            'type': classify(duration, bool(live)),
        })

    entries.sort(key=lambda e: e['published_at'], reverse=True)
    OUTPUT.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'✓ {len(entries)}件を書き出しました: {OUTPUT.name}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
