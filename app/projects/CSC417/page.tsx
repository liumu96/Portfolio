import React from "react";
import Image from "next/image";
import RouterTitle from "@/components/routerTitle";
import Link from "next/link";

const homeworks = [
  {
    title: "1d-mass-spring",
    // previewImage: "/projects/CSC417/a1-mass-spring-1d/mass-spring-1d.gif",
    previewImage: "/projects/CSC417/a1-mass-spring-1d/preview.gif",
    link: "/projects/CSC417/a1-mass-spring-1d",
  },
  {
    title: "3d-mass-spring",
    // previewImage: "/projects/CSC417/mass-spring-3d.gif",
    previewImage: "/projects/CSC417/a2-mass-spring-2d/preview.gif",
    link: "https://github.com/liumu96/CSC417-homeworks/blob/main/a2-mass-spring-3d/README.md",
  },
  {
    title: "FEM",
    previewImage: "/projects/CSC417/a3-fem-3d/preview.gif",
    link: "https://github.com/liumu96/CSC417-homeworks/blob/main/a3-finite-elements-3d/README.md",
  },
  {
    title: "FEM-cloth",
    previewImage: "/projects/CSC417/a4-fem-cloth/preview.gif",
    link: "https://github.com/liumu96/CSC417-homeworks/blob/main/a4-cloth-simulation/README.md",
  },
  {
    title: "rigid-body",
    previewImage: "/projects/CSC417/a5-rigid-body/preview.gif",
    link: "https://github.com/liumu96/CSC417-homeworks/blob/main/a5-rigid-bodies/README.md",
  },
  {
    title: "rigid-body-collision",
    previewImage: "/projects/CSC417/a6-rigid-body-collision/preview.gif",
    link: "https://github.com/liumu96/CSC417-homeworks/blob/main/a6-rigid-contact/README.md",
  },
];

const CSC417 = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-16 md:py-20">
      <RouterTitle title="CSC417-Physics-based Animation" />

      <div className="grid gap-10 md:gap-6 md:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-10">
        {homeworks.map((item, idx) => {
          return (
            <div key={idx} className="mt-1">
              <Link href={item.link}>
                <Image
                  src={item.previewImage}
                  alt=""
                  width={300}
                  height={200}
                  className="shadow-2xl mb-2 rounded border border-purple-300"
                />
                <div className=" px-2 py-2 mt-1 ">{item.title}</div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CSC417;
