'use client';

import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface MarkdownProps {
  children: string;
  className?: string;
}

interface CodeBlockProps {
  language?: string;
  children: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-2xs rounded-sm overflow-hidden border border-neutral-700">
      <button
        onClick={handleCopy}
        className="absolute top-2xs right-2xs p-2xs rounded-sm bg-neutral-800 hover:bg-neutral-700 transition-colors z-10 text-neutral-300"
        aria-label="Copy code"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <SyntaxHighlighter
        language={language}
        style={materialDark}
        customStyle={{
          margin: 0,
          background: '#212121',
          fontSize: '0.75rem',
          padding: '0.75rem',
        }}
        codeTagProps={{
          style: {
            background: 'transparent',
          },
        }}
        PreTag="div"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export const Markdown: React.FC<MarkdownProps> = ({ children, className }) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: (props) => {
            const src = typeof props.src === 'string' ? props.src : '';
            const alt = props.alt ? String(props.alt) : '';
            return (
              <span className="w-full relative h-64 rounded-md overflow-hidden mb-4 block">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  quality={75}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                />
              </span>
            );
          },
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="px-2xs! py-3xs! rounded-sm border border-neutral-300 dark:border-neutral-700 text-small! text-error-500 font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return <CodeBlock language={language}>{String(children).replace(/\n$/, '')}</CodeBlock>;
          },
          input: ({ node, ...props }) => {
            if (props.type === 'checkbox') {
              return <Checkbox checked={props.checked || false} disabled className="shrink-0" />;
            }
            return <input {...props} />;
          },
          ul: ({ node, children, ...props }) => {
            const className = props.className || '';
            if (className.includes('contains-task-list')) {
              return (
                <ul className="list-none pl-0" {...props}>
                  {children}
                </ul>
              );
            }
            return <ul {...props}>{children}</ul>;
          },
          li: ({ node, children, ...props }) => {
            const className = props.className || '';
            if (className.includes('task-list-item')) {
              return (
                <li className="flex items-center gap-2xs !list-none !ml-0" {...props}>
                  {children}
                </li>
              );
            }
            return <li {...props}>{children}</li>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
