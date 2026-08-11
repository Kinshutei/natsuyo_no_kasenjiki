#!/usr/bin/env python3
"""
夜紺 火花さんのYouTubeチャンネルから最新の投稿を取得し、yako_contents.json を更新する。

GitHub Actions から1日1回実行される想定。
消費クォータは1実行あたり3unit（channels 1 + playlistItems 1 + videos 1）。
"""
import json
import os
import sys
import time
from pathlib import Path

import isodate
import requests
from googleapiclient.discovery import build

CHANNEL_ID = 'UCgKjo_iSJpFmXQypArDztYA'  # 夜紺 火花 / Yakon Hibana
MAX_ITEMS = 12
LIVE_MIN_SEC = 6 * 60
OUTPUT = Path(__file__).parent / 'yako_contents.json'


def is_short_video(video_id: str) -> bool:
    """ShortsのURLにアクセスしてリダイレクト先で判定する。

    再生時間での判定では60秒前後の歌ってみた等を取りこぼすため、
    RKMusic_AllSinger_PFR と同じくURLリダイレクトで判定する。
    """
    url = f'https://www.youtube.com/shorts/{video_id}'
    for attempt in range(3):
        try:
            res = requests.head(url, allow_redirects=True, timeout=5)
            return 'shorts' in res.url.lower()
        except Exception:
            if attempt < 2:
                time.sleep(2 ** attempt)
    return False


def classify(video_id: str, duration_sec: int) -> str:
    """判定順序は RKMusic_AllSinger_PFR の determine_video_type に合わせる。

    1. Short（URLリダイレクト判定）
    2. 6分以上 → LiveArchive ／ 6分未満 → Movie

    配信直後は duration が 0 で返るため、6分未満扱いにせず LiveArchive とする。
    翌日以降の実行で正しい秒数に上書きされる。
    """
    if is_short_video(video_id):
        return 'Short'
    if duration_sec <= 0:
        return 'LiveArchive'
    return 'LiveArchive' if duration_sec >= LIVE_MIN_SEC else 'Movie'


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
            'type': classify(vid, duration),
        })

    entries.sort(key=lambda e: e['published_at'], reverse=True)
    OUTPUT.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'✓ {len(entries)}件を書き出しました: {OUTPUT.name}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
