import BlogLayout from "@/components/PostLayout";
import { getAllPostIds, getPostData } from "@/lib/posts";
import MarkdownText from "@/components/MarkdownText";

import React from "react";

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
      <MarkdownText mdtext={postData.markdownContent} />
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
