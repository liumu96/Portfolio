import React from "react";
import Image from "next/image";
import RouterTitle from "@/components/routerTitle";

const homeworks = [
  {
    title: "1d-mass-spring",
    previewImage: "/projects/CSC417/animation.gif",
  },
  {
    title: "3d-mass-spring",
    previewImage: "/projects/CSC417/animation.gif",
  },
  {
    title: "FEM-cloth",
    previewImage: "/projects/CSC417/animation.gif",
  },
  {
    title: "finite-element-method",
    previewImage: "/projects/CSC417/animation.gif",
  },
  {
    title: "rigid-body",
    previewImage: "/projects/CSC417/animation.gif",
  },
  {
    title: "rigid-body-collision",
    previewImage: "/projects/CSC417/animation.gif",
  },
];

const CSC417 = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-16 md:py-20">
      <RouterTitle title="TODO -&gt; CSC417-Physics-based Animation" />

      <div className="grid gap-10 md:gap-6 md:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-10">
        {homeworks.map((item) => {
          return (
            <div>
              <Image
                src={item.previewImage || "/work.jpg"}
                alt=""
                width={300}
                height={200}
                className="shadow-2xl mb-2 rounded border border-purple-300"
              />
              {item.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CSC417;
