"use client";

import { useEffect, useRef, useState } from "react";
import ThreeScene from "@/Utils/three-scene";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FaPlay, FaPauseCircle, FaMinus } from "react-icons/fa";
import { BiShow, BiHide } from "react-icons/bi";
import { VscDebugRestart } from "react-icons/vsc";

const CannonBall3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [threeScene, setThreeScene] = useState<any>(null);
  const [state, setState] = useState<string>("pause");
  const [compliance, setCompliance] = useState(1.0);
  const [show, setShow] = useState<boolean>(false);
  useEffect(() => {
    if (canvasRef.current) {
      const threeScene = new ThreeScene(canvasRef.current);
      threeScene.physicsScene.numSubsteps = 15;
      threeScene.initGrabber();
      threeScene.addCloth();
      threeScene.camera?.position.set(0, 1.0, 1.1);
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
  const restart = () => {
    threeScene.restart();
  };

  useEffect(() => {
    if (threeScene) {
      for (let i = 0; i < threeScene.physicsScene.objects.length; i++)
        threeScene.physicsScene.objects[i].bendingCompliance = compliance;
    }
  }, [compliance]);

  useEffect(() => {
    threeScene?.showEdges();
  }, [show]);
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-6 pt-6 sm:pt-24 md:pt-20 sm:px-8 px-8">
      <IoArrowBackOutline onClick={() => router.back()} />
      <div className="relative px-6 py-3 w-4/5">
        <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text rounded-md">
          Cloth Simulation
        </span>
        <span
          className={`w-32 text-purple-400 flex flex-row justify-center items-center bottom-3
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
            onClick={() => setShow(!show)}
            className="flex items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3 mr-2"
          >
            {show ? <BiHide /> : <BiShow />}
          </button>
          <button
            type="button"
            onClick={restart}
            className="flex items-center border-purple-300 border justify-center flex-1 bg-white shadow-md rounded h-2/3 mr-2"
          >
            <VscDebugRestart />
          </button>
        </span>
        <div
          className={`w-32 text-purple-400 flex flex-col justify-center items-start bottom-3
            absolute left-0 top-0`}
        >
          <label
            htmlFor="small-range"
            className="block  text-sm font-medium mb-2"
          >
            Compliance: {compliance}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={compliance}
            onChange={(e) => setCompliance(+e.target.value)}
            id="small-range"
            className="slider w-full h-2 bg-pink-300 rounded-lg appearance-none cursor-pointer"
          ></input>
        </div>
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
