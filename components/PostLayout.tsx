import React, { ReactNode } from "react";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const PostLayout = ({
  children,
  pagesInfo,
}: {
  children: ReactNode;
  pagesInfo: {
    preId: string;
    nextId: string;
    id: string;
  };
}) => {
  console.log(pagesInfo);
  return (
    <div className="mx-auto max-w-3xl sm:px-6 md:max-w-5xl my-10 py-8 sm:py-16 md:py-20 relative">
      <div className="animate-fadeIn animation-delay-2 border-purple-400 border rounded-md px-4">
        {children}
      </div>
      {/* pagination */}
      <div className="text-purple-400 flex flex-row justify-between items-center py-5 fixed left-1/2 transform -translate-x-1/2 shadow px-2 rounded bottom-10 bg-white font-mono">
        <Link
          href={`/posts/${pagesInfo.preId}`}
          className="flex items-center justify-center"
          style={{
            pointerEvents: !pagesInfo.preId ? "none" : "auto",
          }}
        >
          <FaArrowLeft className="mx-2" /> Pre
        </Link>
        <Link href="/posts" className="mx-10">
          Back to Blog
        </Link>
        <Link
          href={`/posts/${pagesInfo.nextId}`}
          className="flex items-center justify-center"
          style={{
            pointerEvents: !pagesInfo.nextId ? "none" : "auto",
          }}
        >
          Next <FaArrowRight className="mx-2" />
        </Link>
      </div>
    </div>
  );
};

export default PostLayout;
