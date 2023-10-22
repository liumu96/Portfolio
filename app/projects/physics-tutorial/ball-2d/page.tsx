"use client";
import { useEffect, useRef, useState } from "react";
import CanvasScene from "@/Utils/canvas-scene";
import RouterTitle from "@/components/routerTitle";
import MarkdownText from "@/components/MarkdownText";
import description from "@/public/notes/ball-2d.md";

const CannonBall2D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvasScene = new CanvasScene(canvasRef.current);
      canvasScene.addBall();
      canvasScene.update();
    }
  }, []);

  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-6 pt-6 sm:pt-24 md:pt-20 sm:px-8 px-8">
      <RouterTitle title="Ball 2D" />
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
