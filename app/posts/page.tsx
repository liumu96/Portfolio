import SectionHeading from "@/components/SectionHeading";
import React from "react";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import Image from "next/image";

import { getSortedPostsData } from "@/lib/posts.js";

async function getData() {
  const allPosts: IBlogParams[] = getSortedPostsData();
  return {
    allPosts,
  };
}

export default async function Blogs() {
  const { allPosts } = await getData();
  return (
    <div className="mx-auto max-w-3xl sm:px-6 md:max-w-5xl my-10 py-8 sm:py-16 md:py-20">
      <SectionHeading>Posts</SectionHeading>
      <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text px-6 py-3 rounded-md"></span>
      <div className="divide-y divide-slate-200 border-purple-400 border rounded-md px-4">
        {allPosts.map(({ id, comment, title, tags = [], preview }) => {
          return (
            <PostCard>
              <Link href={`/posts/${id}`} className="font-Merriweather">
                <div
                  key={id}
                  className="flex flex-row justify-start items-center"
                >
                  <div className="mr-6">
                    {preview ? (
                      <Image
                        src={preview}
                        height={200}
                        width={200}
                        alt="preview"
                      />
                    ) : (
                      "🔖"
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-bold mb-6">{title}</div>
                    <div>{comment}</div>
                    {/* Categories */}
                    <div className="flex mt-4">
                      {tags.map((tag) => {
                        return (
                          <div className="mr-2 bg-purple-400 p-2 rounded-md text-white">
                            {tag}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            </PostCard>
          );
        })}
      </div>
    </div>
  );
}
