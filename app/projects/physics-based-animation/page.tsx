import RouterTitle from "@/components/routerTitle";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const rigidBodySimulation = [
  {
    title: "Fast-Mass Springs",
    previewImage: "/projects/physics-based-animation/mass-spring.gif",
    link: "/projects/physics-based-animation/fast-mass-spring",
  },
  {
    title: "Position Based Dynamics",
    previewImage: "/projects/GAMES103/preview.jpeg",
    link: "/projects/physics-based-animation/fast-mass-spring",
  },
  {
    title: "Shape Matching",
    previewImage: "/projects/GAMES103/preview.jpeg",
    link: "/projects/physics-based-animation/fast-mass-spring",
  },
  {
    title: "Partial Differential Equations",
    previewImage: "/projects/GAMES103/preview.jpeg",
    link: "/projects/physics-based-animation/fast-mass-spring",
  },
  {
    title: "FEM",
    previewImage: "/projects/GAMES103/preview.jpeg",
    link: "/projects/physics-based-animation/fast-mass-spring",
  },
];

const RigidBodySimulationCollection = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-16 md:py-20">
      <RouterTitle title="TODO -&gt; Physics-based Animation" />
      <div className="grid gap-10 md:gap-6 md:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-10">
        {rigidBodySimulation.map((item, idx) => {
          return (
            <div key={idx} className="mt-1">
              <Link href={item.link}>
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

export default RigidBodySimulationCollection;
