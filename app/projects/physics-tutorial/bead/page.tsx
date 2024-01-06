"use client";

import { useEffect, useRef, useState } from "react";
import CanvasScene from "@/Utils/canvas-scene";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { VscDebugRestart } from "react-icons/vsc";
import { FaPlay, FaPauseCircle, FaStepForward } from "react-icons/fa";
import MarkdownText from "@/components/MarkdownText";
import description from "@/public/notes/The simplest possible physics simulation method.md";

const CannonBall2D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [canvasScene, setCanvasScene] = useState<any>();
  const [state, setState] = useState<string>("pause");
  const [subSteps, setSubSteps] = useState(10);
  useEffect(() => {
    if (canvasRef.current) {
      const canvasScene = new CanvasScene(canvasRef.current);
      canvasScene.setupBeadScene();
      canvasScene.pbdUpdate();
      setCanvasScene(canvasScene);
      setSubSteps(canvasScene.getSubSteps());

      document.addEventListener("keydown", (event) => {
        if (event.key == "s") canvasScene.step();
      });
    }
  }, []);
  const restart = () => {
    location.reload();
  };
  const run = () => {
    if (state == "pause") {
      canvasScene.run();
      setState("run");
    } else {
      canvasScene.pause();
      setState("pause");
    }
  };
  const step = () => {
    canvasScene.step();
  };

  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-6 pt-6 sm:pt-24 md:pt-20 sm:px-8 px-8">
      <IoArrowBackOutline onClick={() => router.back()} />
      <div className="relative px-6 py-3 w-4/5">
        <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text rounded-md">
          Bead
        </span>
        <div
          className={`w-1/4 flex flex-row justify-center items-start bottom-3
            absolute left-0 top-0`}
        >
          <div
            className={`text-purple-400 flex flex-col justify-center items-start`}
          >
            <label
              htmlFor="small-range"
              className="block  text-sm font-medium mb-2"
            >
              SubSteps: {subSteps}
            </label>
            <input
              type="range"
              min="1"
              max="1000"
              value={subSteps}
              onChange={(e) => {
                setSubSteps(+e.target.value);
                canvasScene.setSubSteps(+e.target.value);
              }}
              id="small-range"
              className="slider w-full h-2 bg-pink-300 rounded-lg appearance-none cursor-pointer"
            ></input>
          </div>
          <span className="block  text-sm font-medium mb-2 ml-2">
            PBD Forces: {canvasScene?.getPBDForces().toFixed(2)}
          </span>

          <span className="block  text-sm font-medium mb-2 ml-2">
            Analytic Forces: {canvasScene?.getAnalyticForces().toFixed(2)}
          </span>
        </div>

        <span
          className={`w-32 text-purple-400 flex flex-row justify-center items-center bottom-3
            absolute right-0 top-0`}
        >
          <button
            type="button"
            onClick={run}
            className="flex mr-2 items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3"
          >
            {state == "pause" ? <FaPlay /> : <FaPauseCircle />}
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
      <MarkdownText mdtext={description}></MarkdownText>
    </div>
  );
};

export default CannonBall2D;
