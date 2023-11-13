import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

const MarkdownText = ({ mdtext }: { mdtext: string }) => {
  return (
    <article className="content text-left mt-3">
      <ReactMarkdown
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                PreTag="section"
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                style={materialDark}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        className="prose md:prose-lg lg:prose-xl dark:text-neutral-100 dark:prose-h3:text-neutral-100"
      >
        {mdtext}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownText;
