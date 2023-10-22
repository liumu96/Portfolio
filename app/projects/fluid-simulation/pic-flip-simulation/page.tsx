"use client";

import RouterTitle from "@/components/routerTitle";
import { useRef } from "react";

const FlipFluid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-6 pt-6 sm:pt-24 md:pt-20 sm:px-8 px-8">
      <RouterTitle title="Flip Fluid" />
      <div>
        <button
          type="button"
          className="flex items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3 mr-2"
        >
          Start
        </button>
      </div>
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{
          border: "1px solid",
          width: "calc(100vw - 40%)",
          height: "calc(100vh - 300px)",
        }}
      ></canvas>
    </div>
  );
};

export default FlipFluid;
