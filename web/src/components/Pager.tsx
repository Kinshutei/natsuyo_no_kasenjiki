interface Props {
  page: number
  total: number
  onChange: (p: number) => void
}

/** ◀ 現在ページ / 総ページ ▶ の送り。1ページに収まるときは何も出さない */
export function Pager({ page, total, onChange }: Props) {
  if (total <= 1) return null
  return (
    <div className="pager">
      <button
        type="button"
        className="pager__btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="前のページ"
      >
        <span aria-hidden="true">◀</span>
      </button>
      <span className="pager__count">
        <strong>{page}</strong> / {total}
      </span>
      <button
        type="button"
        className="pager__btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= total}
        aria-label="次のページ"
      >
        <span aria-hidden="true">▶</span>
      </button>
    </div>
  )
}
