import React from "react";
import Image from "next/image";
import RouterTitle from "@/components/routerTitle";
import Link from "next/link";

const gamesHW = [
  {
    title: "Angry Bunny",
    previewImage: "/projects/rigid-body/bunny.png",
    link: "/projects/GAMES103/bunny",
  },
  {
    title: "Cloth Simulation",
    previewImage: "/projects/rigid-body/bunny.png",
    link: "/projects/GAMES103/cloth",
  },
  {
    title: "Bouncy House",
    previewImage: "/projects/rigid-body/bunny.png",
    link: "/projects/GAMES103/bouncy-house",
  },
  {
    title: "Pool Ripple",
    previewImage: "/projects/GAMES103/ripple.gif",
    link: "/projects/GAMES103/ripple",
  },
];

const CSC417 = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-16 md:py-20">
      <RouterTitle title="TODO -&gt; GAMES103-Physics-based Animation" />

      <div className="grid gap-10 md:gap-6 md:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-10">
        {gamesHW.map((item, idx) => {
          return (
            <div key={idx} className="mt-1">
              <Link href={item.link || "https://fluid-2d.vercel.app/"}>
                <img
                  src={item.previewImage}
                  alt=""
                  width={300}
                  height={200}
                  // className="rounded-lg shadow-lg"
                  style={{ height: "98%", objectFit: "cover" }}
                  className="shadow-lg rounded border border-purple-300"
                />
              </Link>
              <div className=" px-2 py-2 mt-1 ">{item.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CSC417;
