"use client";

import { useEffect, useRef } from "react";
import CanvasScene from "@/Utils/canvas-scene";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const CannonBall2D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (canvasRef.current) {
      const canvasScene = new CanvasScene(canvasRef.current);
      canvasScene.addBall();
      canvasScene.update();
    }
  }, []);

  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-6 pt-6 sm:pt-24 md:pt-20 sm:px-8 px-8">
      <IoArrowBackOutline onClick={() => router.back()} />
      <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text px-6 py-3 rounded-md">
        Ball 2D
      </span>
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

export default CannonBall2D;
