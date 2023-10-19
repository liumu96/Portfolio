"use client";

import { useEffect, useRef, useState } from "react";
import CanvasScene from "@/Utils/canvas-scene";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { VscDebugRestart } from "react-icons/vsc";
import { FaPlay, FaStepForward } from "react-icons/fa";

const CannonBall2D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [canvasScene, setCanvasScene] = useState<any>();
  useEffect(() => {
    if (canvasRef.current) {
      const canvasScene = new CanvasScene(canvasRef.current);
      canvasScene.physicsScene.dt = 0.01;
      canvasScene.setupPendulumScene(0);
      canvasScene.pbdUpdate();
      setCanvasScene(canvasScene);

      document.addEventListener("keydown", (event) => {
        if (event.key == "s") canvasScene.step();
      });
    }
  }, []);
  const restart = () => {
    canvasScene.setupPendulumScene(Math.random() * 6);
  };
  const run = () => {
    canvasScene.run();
  };
  const step = () => {
    canvasScene.step();
  };

  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-6 pt-6 sm:pt-24 md:pt-20 sm:px-8 px-8">
      <IoArrowBackOutline onClick={() => router.back()} />
      <div className="relative px-6 py-3 w-4/5">
        <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text rounded-md">
          Pendulum
        </span>
        <span
          className={`w-32 text-purple-400 flex flex-row justify-center items-center bottom-3
            absolute right-0 top-0`}
        >
          <button
            type="button"
            onClick={run}
            className="flex mr-2 items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3"
          >
            <FaPlay />
          </button>
          <button
            type="button"
            onClick={restart}
            className="flex mr-2 items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3"
          >
            <VscDebugRestart />
          </button>
          <button
            type="button"
            onClick={step}
            className="flex items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3 mr-4"
          >
            <FaStepForward />
          </button>
        </span>
        {/* <span
          className={`w-36 text-purple-400 flex flex-col justify-center items-start bottom-3
            absolute left-0 top-0`}
        >
          <div>PBD Force: {localStorage.getItem("force")}</div>
          <div>Analytic Force:{localStorage.getItem("analyticForce")}</div>
        </span> */}
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

export default CannonBall2D;
