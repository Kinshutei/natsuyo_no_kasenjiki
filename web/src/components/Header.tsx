import { NAV, SITE } from '../site'

export function Header() {
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
    </header>
  )
}
