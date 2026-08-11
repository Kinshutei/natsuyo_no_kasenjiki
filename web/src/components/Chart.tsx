import Plot from 'react-plotly.js'
import type { Data } from 'plotly.js'

const NAVY = '#16203a'

const LAYOUT_BASE = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { family: "'Hiragino Sans','Noto Sans JP',sans-serif", size: 11, color: NAVY },
  showlegend: false,
} as const

const CONFIG = { displayModeBar: false, responsive: true } as const

export interface ChartProps {
  data: Data[]
  height: number
  /** 横棒グラフでラベルを収めるための左マージン */
  marginLeft?: number
  marginBottom?: number
}

/**
 * Plotly の import をこのファイルだけに閉じ込める。
 * Repertoire から lazy 読み込みすることで、初回表示のバンドルから切り離している。
 */
export default function Chart({ data, height, marginLeft = 60, marginBottom = 60 }: ChartProps) {
  return (
    <Plot
      data={data}
      layout={{ ...LAYOUT_BASE, height, margin: { l: marginLeft, r: 16, t: 16, b: marginBottom } }}
      config={CONFIG}
      style={{ width: '100%' }}
      useResizeHandler
    />
  )
}
