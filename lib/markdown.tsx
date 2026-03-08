import type { ReactNode } from 'react'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

type MarkdownBlock =
  | { type: 'heading'; level: HeadingLevel; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }

function isSafeHref(href: string) {
  return /^(https?:\/\/|mailto:|\/)/i.test(href)
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null = pattern.exec(text)

  while (match) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[2] && match[3]) {
      const label = match[2]
      const href = match[3]
      nodes.push(
        isSafeHref(href) ? (
          <a
            key={`${href}-${match.index}`}
            href={href}
            target={href.startsWith('/') || href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('/') || href.startsWith('mailto:') ? undefined : 'noreferrer'}
            className="font-medium text-sky-700 underline underline-offset-2"
          >
            {label}
          </a>
        ) : (
          label
        ),
      )
    } else if (match[4]) {
      nodes.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-slate-900">
          {match[4]}
        </strong>,
      )
    } else if (match[5]) {
      nodes.push(
        <em key={`italic-${match.index}`} className="italic">
          {match[5]}
        </em>,
      )
    } else if (match[6]) {
      nodes.push(
        <code key={`code-${match.index}`} className="rounded bg-slate-100 px-1 py-0.5 text-[0.95em] text-slate-800">
          {match[6]}
        </code>,
      )
    }

    lastIndex = pattern.lastIndex
    match = pattern.exec(text)
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function parseMarkdownBlocks(content: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  let paragraphLines: string[] = []
  let unorderedItems: string[] = []
  let orderedItems: string[] = []

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return
    blocks.push({ type: 'paragraph', content: paragraphLines.join(' ') })
    paragraphLines = []
  }

  const flushUnorderedList = () => {
    if (unorderedItems.length === 0) return
    blocks.push({ type: 'unordered-list', items: unorderedItems })
    unorderedItems = []
  }

  const flushOrderedList = () => {
    if (orderedItems.length === 0) return
    blocks.push({ type: 'ordered-list', items: orderedItems })
    orderedItems = []
  }

  const flushAll = () => {
    flushParagraph()
    flushUnorderedList()
    flushOrderedList()
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      flushAll()
      continue
    }

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line)
    if (headingMatch) {
      flushAll()
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length as HeadingLevel,
        content: headingMatch[2],
      })
      continue
    }

    const unorderedMatch = /^[-*]\s+(.*)$/.exec(line)
    if (unorderedMatch) {
      flushParagraph()
      flushOrderedList()
      unorderedItems.push(unorderedMatch[1])
      continue
    }

    const orderedMatch = /^\d+\.\s+(.*)$/.exec(line)
    if (orderedMatch) {
      flushParagraph()
      flushUnorderedList()
      orderedItems.push(orderedMatch[1])
      continue
    }

    flushUnorderedList()
    flushOrderedList()
    paragraphLines.push(line)
  }

  flushAll()
  return blocks
}

const headingClasses: Record<HeadingLevel, string> = {
  1: 'mt-5 text-3xl font-bold text-slate-900',
  2: 'mt-5 text-2xl font-bold text-slate-900',
  3: 'mt-4 text-xl font-semibold text-slate-900',
  4: 'mt-4 text-lg font-semibold text-slate-900',
  5: 'mt-3 text-base font-semibold text-slate-900',
  6: 'mt-3 text-sm font-semibold uppercase tracking-wide text-slate-700',
}

export function renderMarkdownContent(content: string): ReactNode[] {
  return parseMarkdownBlocks(content).map((block, index) => {
    if (block.type === 'heading') {
      switch (block.level) {
        case 1:
          return (
            <h1 key={`heading-${index}`} className={headingClasses[1]}>
              {renderInlineMarkdown(block.content)}
            </h1>
          )
        case 2:
          return (
            <h2 key={`heading-${index}`} className={headingClasses[2]}>
              {renderInlineMarkdown(block.content)}
            </h2>
          )
        case 3:
          return (
            <h3 key={`heading-${index}`} className={headingClasses[3]}>
              {renderInlineMarkdown(block.content)}
            </h3>
          )
        case 4:
          return (
            <h4 key={`heading-${index}`} className={headingClasses[4]}>
              {renderInlineMarkdown(block.content)}
            </h4>
          )
        case 5:
          return (
            <h5 key={`heading-${index}`} className={headingClasses[5]}>
              {renderInlineMarkdown(block.content)}
            </h5>
          )
        case 6:
          return (
            <h6 key={`heading-${index}`} className={headingClasses[6]}>
              {renderInlineMarkdown(block.content)}
            </h6>
          )
      }
    }

    if (block.type === 'unordered-list') {
      return (
        <ul key={`unordered-${index}`} className="mb-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
          {block.items.map((item, itemIndex) => (
            <li key={`unordered-item-${index}-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      )
    }

    if (block.type === 'ordered-list') {
      return (
        <ol key={`ordered-${index}`} className="mb-3 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-700">
          {block.items.map((item, itemIndex) => (
            <li key={`ordered-item-${index}-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>
      )
    }

    return (
      <p key={`paragraph-${index}`} className="mb-3 text-sm leading-6 text-slate-700">
        {renderInlineMarkdown(block.content)}
      </p>
    )
  })
}
