import { Reveal } from './Reveal'

export function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <Reveal className="section__head">
      <h2 className="section__title">{title}</h2>
      <p className="section__sub">{sub}</p>
    </Reveal>
  )
}
