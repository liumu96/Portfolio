"use client";

import { useEffect, useRef, useState } from "react";
import CanvasScene from "@/Utils/canvas-scene";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { VscDebugRestart } from "react-icons/vsc";

const CannonBall2D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [restitution, setRestitution] = useState(10);
  const [canvasScene, setCanvasScene] = useState<any>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvasScene = new CanvasScene(canvasRef.current);
      canvasScene.physicsScene.gravity.y = 0.0;
      canvasScene.setupMultiBalls(40);
      canvasScene.updateNew();
      setCanvasScene(canvasScene);
    }
  }, []);
  const restart = () => {
    location.reload();
  };
  useEffect(() => {
    if (canvasScene) {
      canvasScene.physicsScene.restitution = restitution / 10;
    }
  }, [restitution]);

  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-6 pt-6 sm:pt-24 md:pt-20 sm:px-8 px-8">
      <IoArrowBackOutline onClick={() => router.back()} />
      <div className="relative px-6 py-3 w-3/5">
        <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text rounded-md">
          Ballard
        </span>
        <span
          className={`w-32 text-purple-400 flex flex-row justify-center items-center bottom-3
            absolute right-0 top-0`}
        >
          <button
            type="button"
            onClick={restart}
            className="flex mr-4 items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3"
          >
            <VscDebugRestart />
          </button>
          <div className="flex-1">
            <label htmlFor="small-range" className="block  text-sm font-medium">
              {canvasScene?.physicsScene.restitution}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={restitution}
              onChange={(e) => setRestitution(+e.target.value)}
              id="small-range"
              className="slider w-full h-2 bg-pink-300 rounded-lg appearance-none cursor-pointer"
            ></input>
          </div>
        </span>
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
