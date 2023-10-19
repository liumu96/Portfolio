"use client";

import { useEffect, useRef, useState } from "react";
import ThreeScene from "@/Utils/three-scene";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FaPlay, FaPauseCircle } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";

const CannonBall3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [threeScene, setThreeScene] = useState<any>(null);
  const [state, setState] = useState<string>("pause");
  useEffect(() => {
    if (canvasRef.current) {
      const threeScene = new ThreeScene(canvasRef.current);
      threeScene.addBall3D();
      threeScene.addBox();
      threeScene.addSpotLight();
      threeScene.addDirLight();
      threeScene.update();
      setThreeScene(threeScene);
    }
  }, []);

  const run = () => {
    if (state == "pause") {
      threeScene.run();
      setState("run");
    } else {
      threeScene.pause();
      setState("pause");
    }
  };
  const restart = () => {
    threeScene.restart();
  };

  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-6 pt-6 sm:pt-24 md:pt-20 sm:px-8 px-8">
      <IoArrowBackOutline onClick={() => router.back()} />
      <div className="relative px-6 py-3 w-3/5">
        <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text rounded-md">
          Ball 3D
        </span>
        <span
          className={`w-24  text-purple-400 flex flex-row justify-center items-center bottom-3
            absolute right-0 top-0`}
        >
          <button
            type="button"
            onClick={run}
            className="flex items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3 mr-4"
          >
            {state == "pause" ? <FaPlay /> : <FaPauseCircle />}
          </button>
          <button
            type="button"
            onClick={restart}
            className="flex items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3"
          >
            <VscDebugRestart />
          </button>
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

export default CannonBall3D;
