import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  children: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  return (
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
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
