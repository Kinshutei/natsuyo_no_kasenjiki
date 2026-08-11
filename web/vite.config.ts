import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// ★ GitHubリポジトリ名
const REPO_NAME = '/natsuyo_no_kasenjiki/'

const DATA_FILES = ['streaminginfo_Yako.json', 'rkmusic_song_master.json', 'yako_contents.json']
const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url))

/**
 * データJSONはリポジトリ直下にあり web/ の外なので、dev サーバーからは見えない。
 * 開発時だけ /data/*.json として配信し、本番と同じ経路でfetchできるようにする。
 */
function localDataPlugin(): Plugin {
  return {
    name: 'yako-local-data',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? ''
        const idx = url.indexOf('/data/')
        if (idx === -1) return next()
        const name = url.slice(idx + 6).split('?')[0]
        if (!DATA_FILES.includes(name)) return next()
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(readFileSync(REPO_ROOT + name, 'utf-8'))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localDataPlugin()],
  base: REPO_NAME,
})
