import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
SyntaxHighlighter.registerLanguage("jsx", jsx);

const MarkdownText = ({ mdtext }: { mdtext: string }) => {
  const MarkdownComponents: object = {
    // SyntaxHighlight code will go here
    // code({ children, ...props }: { children: any }) {
    //   return (
    //     <SyntaxHighlighter
    //       children={children}
    //       {...props}
    //       language="javascript"
    //     />
    //   );
    // },
  };
  return (
    <article className="content text-left mt-3">
      <ReactMarkdown
        components={MarkdownComponents}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        className="prose md:prose-lg lg:prose-xl"
      >
        {mdtext}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownText;
