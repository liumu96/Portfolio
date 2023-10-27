"use client";
import RouterTitle from "@/components/routerTitle";
import { AiOutlineGithub } from "react-icons/ai";

const House = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-6 pt-6 sm:pt-24 md:pt-20 sm:px-8 px-8">
      <RouterTitle title="Fast Mass Spring" />
      <div className="">
        <a
          href="https://github.com/liumu96/Fast-Mass-Spring"
          target="_blank"
          className="rounded-full shadow-2xl  px-2 py-2 "
        >
          <AiOutlineGithub
            size={35}
            className="hover:-translate-y-1 transition-transform cursor-pointer  dark:text-neutral-100"
          />
        </a>
      </div>
      {/* <div className="grid gap-10 md:gap-6 md:grid-cols-2 sm:gap-3 lg:gap-10 space-y-16 px-5 md:px-20"> */}
      <div className=" text-justify px-20 md:px-20 mb-4">
        Mass-spring systems are a fundamental concept in computer graphics and
        physics simulations, with applications ranging from animation and video
        games to engineering and scientific modeling. The paper "
        <a
          target="_blank"
          href="https://users.cs.utah.edu/~ladislav/liu13fast/liu13fast.html"
          className="text-purple-500"
        >
          Fast Simulation of Mass-Spring Systems
        </a>
        " presents innovative techniques that promise to revolutionize the
        efficiency of simulating these systems. This repository is based on{" "}
        <a
          target="_blank"
          href="https://github.com/sam007961/FastMassSpring"
          className="text-purple-500"
        >
          FastMassSpring
        </a>
        , replacing the `glut` with `glew`.
      </div>
      <div className="grid gap-10 md:gap-6 md:grid-cols-2 sm:gap-3 lg:gap-10">
        <img
          src="/projects/physics-based-animation/mass-spring.gif"
          alt=""
          className="shadow-lg rounded border border-purple-300"
        />
        <img
          src="/projects/physics-based-animation/cloth-ball.gif"
          alt=""
          className="shadow-lg rounded border border-purple-300"
        />
      </div>
    </div>
  );
};

export default House;
