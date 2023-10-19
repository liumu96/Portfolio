import React from "react";

const fluidSimulation = [
  {
    name: "Eulerian Fluid Simulator",
  },
  {
    name: "FLIP Fluid Simulator",
  },
  {
    name: "Height-Field Water Simulation",
  },
  {
    name: "Smoke Simulation",
  },
];

const FluidSimulation = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-16 md:py-20">
      <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text px-6 py-3 rounded-md">
        Fluid Simulation
      </span>
      <div className="grid gap-10 md:gap-6 md:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-10">
        {fluidSimulation.map((item) => {
          return <div>{item.name}</div>;
        })}
      </div>
    </div>
  );
};

export default FluidSimulation;
