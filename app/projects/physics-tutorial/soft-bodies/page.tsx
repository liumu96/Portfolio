"use client";

import { useEffect, useRef, useState } from "react";
import ThreeScene from "@/Utils/three-scene";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FaPlay, FaPauseCircle, FaPlus, FaMinus } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";
import MarkdownText from "@/components/MarkdownText";
import description from "@/public/notes/soft-body.md";

const CannonBall3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [threeScene, setThreeScene] = useState<any>(null);
  const [state, setState] = useState<string>("pause");
  useEffect(() => {
    if (canvasRef.current) {
      const threeScene = new ThreeScene(canvasRef.current);
      threeScene.initGrabber();
      threeScene.addBunnyMesh();
      threeScene.camera?.position.set(0, 1, 2);
      threeScene.cameraControl.target.y = 0.5;
      threeScene.addSpotLight();
      threeScene.addGround();
      threeScene.update("xpbd");
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
  const addBunny = () => {
    threeScene.addBunnyMesh();
  };
  const restart = () => {
    threeScene.restart();
  };
  const squash = () => {
    threeScene.squash();
  };

  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-6 pt-6 sm:pt-24 md:pt-20 sm:px-8 px-8">
      <IoArrowBackOutline onClick={() => router.back()} />
      <div className="relative px-6 py-3 w-3/5">
        <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text rounded-md">
          Soft Bodies
        </span>
        <span
          className={`w-32  text-purple-400 flex flex-row justify-center items-center bottom-3
            absolute right-0 top-0`}
        >
          <button
            type="button"
            onClick={run}
            className="flex items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3 mr-2"
          >
            {state == "pause" ? <FaPlay /> : <FaPauseCircle />}
          </button>

          <button
            type="button"
            onClick={addBunny}
            className="flex mr-2 items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3"
          >
            <FaPlus />
          </button>
          <button
            type="button"
            onClick={squash}
            className="flex mr-2 items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3"
          >
            <FaMinus />
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
      <MarkdownText mdtext={description}></MarkdownText>
    </div>
  );
};

export default CannonBall3D;
