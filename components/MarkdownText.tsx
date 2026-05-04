import ReactMarkdown from "react-markdown";

const baseTextClasses = "text-sm leading-relaxed text-[#e8eeff]/88";

const components = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-3 font-serif text-xl text-[#eef1ff]">{children}</h2>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-3 font-serif text-lg text-[#eef1ff]">{children}</h3>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="mt-3 font-serif text-base text-[#eef1ff]">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className={`mb-3 last:mb-0 ${baseTextClasses}`}>{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-3 list-disc space-y-1 pl-4 text-sm text-[#e8eeff]/88">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-4 text-sm text-[#e8eeff]/88">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="marker:text-[var(--gold)]/70">{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-[#eef1ff]">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="text-[#eef1ff]/95">{children}</em>
  ),
};

type MarkdownTextProps = {
  source: string;
};

export function MarkdownText({ source }: MarkdownTextProps) {
  return <ReactMarkdown components={components}>{source}</ReactMarkdown>;
}

/** Strip basic markdown to a plain-text snippet for previews / cards. */
export function stripMarkdown(source: string): string {
  return source
    .replace(/^#+\s+/gm, "")
    .replace(/(^|\s)#{1,6}\s+/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\n{2,}/g, " · ")
    .replace(/\s+/g, " ")
    .trim();
}
