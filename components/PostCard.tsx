import React, { ReactNode } from "react";

const PostCard = ({ children }: { children: ReactNode }) => {
  return <div className="py-4">{children}</div>;
};

export default PostCard;
