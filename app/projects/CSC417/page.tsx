import React from "react";
import Image from "next/image";
import RouterTitle from "@/components/routerTitle";
import Link from "next/link";

const homeworks = [
  {
    title: "1d-mass-spring",
    previewImage: "/projects/CSC417/a1-mass-spring-1d/mass-spring-1d.gif",
    link: "/projects/CSC417/a1-mass-spring-1d",
  },
  {
    title: "3d-mass-spring",
    previewImage: "/projects/CSC417/mass-spring-3d.gif",
    link: "/projects/CSC417/a1-mass-spring-1d",
  },
  {
    title: "FEM",
    previewImage: "/projects/CSC417/animation.gif",
    link: "/projects/CSC417/a1-mass-spring-1d",
  },
  {
    title: "FEM-cloth",
    previewImage: "/projects/CSC417/animation.gif",
    link: "/projects/CSC417/a1-mass-spring-1d",
  },
  {
    title: "rigid-body",
    previewImage: "/projects/CSC417/animation.gif",
    link: "/projects/CSC417/a1-mass-spring-1d",
  },
  {
    title: "rigid-body-collision",
    previewImage: "/projects/CSC417/animation.gif",
    link: "/projects/CSC417/a1-mass-spring-1d",
  },
];

const CSC417 = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-16 md:py-20">
      <RouterTitle title="Ing -&gt; CSC417-Physics-based Animation" />

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
