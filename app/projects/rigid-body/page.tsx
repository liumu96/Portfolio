import React from "react";

const rigidBodySimulation = [
  {
    name: "Pinball",
  },
  {
    name: "Pemdulum",
  },
  {
    name: "Bunny",
  },
  {
    name: "Soft Body",
  },
  {
    name: "Self Collisions",
  },
];

const RigidBodySimulationCollection = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-16 md:py-20">
      <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text px-6 py-3 rounded-md">
        Rigid Body Simulation
      </span>
    </div>
  );
};

export default RigidBodySimulationCollection;
