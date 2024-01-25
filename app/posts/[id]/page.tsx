import BlogLayout from "@/components/PostLayout";
import { getAllPostIds, getPostData } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import React from "react";
import "katex/dist/katex.min.css";

async function getData({ params }: { params: { id: string } }) {
  const postData: any = await getPostData(params.id);
  return {
    postData,
  };
}

export default async function Post({ params }: { params: { id: string } }) {
  const { postData } = await getData({ params });
  return (
    <BlogLayout pagesInfo={postData.pagesInfo}>
      <br />
      <ReactMarkdown className=" w-full prose md:prose-lg lg:prose-xl dark:text-neutral-100 dark:prose-h3:text-neutral-100">
        {postData.markdownContent}
      </ReactMarkdown>
      {/* {postData.date} */}
    </BlogLayout>
  );
}

export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}
