import { NAV, SITE } from '../site'

interface Props {
  meteorsOn: boolean
  onToggleMeteors: () => void
}

export function Header({ meteorsOn, onToggleMeteors }: Props) {
  return (
    <header className="site-header">
      <a className="site-header__logo" href="#top">
        {SITE.nameRomaji} <em>DB</em>
      </a>
      <nav className="site-header__nav">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`}>{n.label}</a>
        ))}
      </nav>
      <button
        type="button"
        className={`meteor-toggle ${meteorsOn ? 'is-on' : ''}`}
        onClick={onToggleMeteors}
        aria-pressed={meteorsOn}
      >
        流星群
        <span className="meteor-toggle__state">{meteorsOn ? 'ON' : 'OFF'}</span>
      </button>
    </header>
  )
}
