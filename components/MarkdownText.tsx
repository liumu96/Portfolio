"use client";
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
  const P = ({ children }: { children?: any }) => (
    <p className="md-post-p">{children}</p>
  );
  const Li = ({ children }: { children?: any }) => (
    <li className="md-post-li">{children}</li>
  );
  const H4 = ({ children }: { children?: any }) => (
    <h4 className="md-post-h4">{children}</h4>
  );
  const Hr = () => <hr className="md-post-hr" />;
  return (
    <article className="content text-left mt-3 font-Merriweather">
      <ReactMarkdown
        components={{
          p: P,
          li: Li,
          h4: H4,
          hr: Hr,
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
