import SectionHeading from "@/components/SectionHeading";
import React from "react";
import { AiOutlineGithub, AiOutlineLink } from "react-icons/ai";

const projectsArr = [
  {
    previewImage: "/projects/fluid-2d/preview.png",
    title: "Fluid-2D",
    type: ["js", "threejs", "fluid"],
    web: "https://fluid-2d.vercel.app/",
    github: "https://github.com/liumu96/Fluid-2D",
  },
];

const Projects = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-16 md:py-20">
      <SectionHeading>Projects</SectionHeading>
      {/* <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text px-6 py-3 rounded-md">
        TODO
      </span> */}
      <p className="mb-0 mt-2 px-5 md:pd-20">
        Here are some coding exercises that focus on basic physics simulations
        and animations.
      </p>
      <p className="mb-8 mt-0 px-5 md:pd-20">
        Practicing these algorithms can help me gain a deeper understanding of
        the underlying principles.
      </p>

      <div className="flex flex-col px-10 md:pd-20">
        {projectsArr.map((project) => {
          return (
            <div className="flex md:flex-row sm:flex-col items-start  flex-col">
              <div className="flex-1 cursor-pointer">
                {project.web && (
                  <a href={project.web} rel="noreferrer" target="_blank">
                    <img
                      src={project.previewImage}
                      className="rounded-lg shadow-lg w-fit"
                    />
                  </a>
                )}
              </div>
              <div className="flex-1 flex flex-col items-start pl-0 md:pl-8">
                <h2 className="invisible md:visible">{project.title}</h2>
                description
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
