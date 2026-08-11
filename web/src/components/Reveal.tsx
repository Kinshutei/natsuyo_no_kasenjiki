import type { ReactNode } from 'react'
import { useInView } from '../hooks/useReveal'

interface Props {
  children: ReactNode
  className?: string
  /** 連続する要素をずらして出したいときの遅延（ms） */
  delay?: number
}

/** スクロールで視界に入ったときにフェードインさせるラッパー */
export function Reveal({ children, className, delay = 0 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={['reveal', inView ? 'is-visible' : '', className].filter(Boolean).join(' ')}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
