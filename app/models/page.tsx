"use client";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";

import SectionHeading from "@/components/SectionHeading";
import SlideUp from "@/components/SlideUp";

const models = [
  {
    previewPath: "/models/Balls-01/render.mp4",
    previewImage: "/models/Balls-01/preview.jpg",
    categories: ["Rigid Bodies"],
    type: "video",
    description: "",
  },
  {
    previewPath: "/models/Balls-02/render.mp4",
    previewImage: "/models/Balls-02/preview.png",
    categories: ["Rigid Bodies"],
    type: "video",
    description: "",
  },
  {
    previewPath: "/models/Cloth-01/render.mp4",
    previewImage: "/models/Cloth-01/preview.png",
    categories: ["Cloth"],
    type: "video",
    description: "",
  },
  {
    previewPath: "/models/Cloth-02/render.mp4",
    previewImage: "/models/Cloth-02/preview.png",
    categories: ["Cloth"],
    type: "video",
    description: "",
  },
  {
    previewPath: "/models/Fire&Smoke/render.mp4",
    previewImage: "/models/Fire&Smoke/preview.jpg",
    categories: ["Smoke", "Fire"],
    type: "video",
    description: "",
  },
  {
    previewPath: "/models/Smoke/render.mp4",
    previewImage: "/models/Smoke/preview.jpg",
    categories: ["Smoke"],
    type: "video",
    description: "",
  },
  {
    previewPath: "/models/SoftBody-01/render.mp4",
    previewImage: "/models/SoftBody-01/preview.png",
    categories: ["Soft Body"],
    type: "video",
    description: "",
  },
  {
    previewPath: "/models/SoftBody-01/render.mp4",
    previewImage: "/models/Fluid-01/preview.png",
    categories: ["Fluid"],
    type: "video",
    description: "",
  },
];
const renderEffects = [
  {
    previewImage: "/models/Forest-01/preview.png",
    categories: ["Render", "Nature"],
    type: "image",
    description: "",
  },
];

const Models = () => {
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);
  if (!hasWindow) return <></>;
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-24 md:py-20 sm:px-8 px-8">
      <SectionHeading>Models</SectionHeading>
      <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text px-6 py-3 rounded-md">
        Blender Physics Animation
      </span>
      <p className="mb-8 mt-2 font-bold text-lg">
        Here are some physics animation effects I've created in Blender, which
        help to achieve a basic level of realism.
      </p>
      <div className="grid gap-10 md:gap-6 md:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-10">
        {models.map((model, idx) => {
          return (
            <div key={idx}>
              {/* <SlideUp offset="-300px 0px -300px 0px"> */}
              <div className="flex justify-center">
                {model.type === "video" && model.previewPath && (
                  <ReactPlayer
                    controls
                    muted={true}
                    playing={true}
                    light={
                      <img
                        src={model.previewImage}
                        alt="Thumbnail"
                        className="rounded-lg shadow-lg"
                        style={{ height: "98%", objectFit: "cover" }}
                      />
                    }
                    url={model.previewPath}
                    width="98%"
                    height="98%"
                  />
                )}
              </div>

              <div className="flex flex-row md:mx-0 sm:mx-0 mx-0 mt-2 flex-wrap">
                {model.categories.map((category, idx) => {
                  return (
                    <div
                      key={idx}
                      className="bg-purple-400 mr-1 mt-1 px-2 py-2 text-white rounded"
                    >
                      {category}
                    </div>
                  );
                })}
              </div>
              {/* </SlideUp> */}
            </div>
          );
        })}
      </div>
      <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text px-6 py-3 rounded-md">
        Others
      </span>
      <div className="grid gap-10 md:gap-6 md:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-10">
        {renderEffects.map((model, idx) => {
          return (
            <div key={idx}>
              {/* <SlideUp offset="-300px 0px -300px 0px"> */}
              <div className="flex justify-center ">
                {model.type === "image" && (
                  <img
                    src={model.previewImage}
                    alt="Thumbnail"
                    className="rounded-lg shadow-lg"
                    style={{ height: "98%", objectFit: "cover" }}
                  />
                )}
              </div>

              <div className="flex flex-row md:mx-0 sm:mx-0 mx-0 mt-2 flex-wrap">
                {model.categories.map((category, idx) => {
                  return (
                    <div
                      key={idx}
                      className="bg-purple-500 mr-1 mt-1 px-2 py-2 text-white rounded"
                    >
                      {category}
                    </div>
                  );
                })}
              </div>
              {/* </SlideUp> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Models;
