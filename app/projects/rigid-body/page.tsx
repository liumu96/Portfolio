import RouterTitle from "@/components/routerTitle";
import React from "react";
import Image from "next/image";

const rigidBodySimulation = [
  {
    title: "Eulerian Fluid Simulator",
    previewImage: "/projects/GAMES103/preview.jpeg",
  },
];

const RigidBodySimulationCollection = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-16 md:py-20">
      <RouterTitle title="TODO -&gt; Rigid Body Simulation" />
      <div className="grid gap-10 md:gap-6 md:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-10">
        {rigidBodySimulation.map((item) => {
          return (
            <div>
              <Image
                src={item.previewImage}
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

export default RigidBodySimulationCollection;
