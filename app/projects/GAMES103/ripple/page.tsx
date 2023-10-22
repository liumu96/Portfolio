"use client";
import RouterTitle from "@/components/routerTitle";
import React from "react";
import { AiOutlineGithub } from "react-icons/ai";

const Ripple = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-6 pt-6 sm:pt-24 md:pt-20 sm:px-8 px-8">
      <RouterTitle title="Pool Ripple" />
      <div>
        <a
          href="https://github.com/liumu96/GAMES103-Homework/tree/main/HW4"
          target="_blank"
          className="rounded-full shadow-2xl  px-2 py-2 "
        >
          <AiOutlineGithub
            size={35}
            className="hover:-translate-y-1 transition-transform cursor-pointer  dark:text-neutral-100"
          />
        </a>
      </div>
      <iframe
        src="/WebGL/ripple-01/index.html"
        style={{
          width: "100%",
          height: "650px",
        }}
      ></iframe>
      <iframe
        src="/WebGL/ripple-02/index.html"
        style={{
          width: "100%",
          height: "650px",
        }}
      ></iframe>
      <iframe
        src="/WebGL/ripple/index.html"
        style={{
          width: "100%",
          height: "650px",
        }}
      ></iframe>
    </div>
  );
};

export default Ripple;
