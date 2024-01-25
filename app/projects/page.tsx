import SectionHeading from "@/components/SectionHeading";
import React from "react";
import ProjectsSection from "@/components/ProjectsSection";

const Projects = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-16 md:py-20">
      <SectionHeading>Projects</SectionHeading>
      <p className="mb-0 mt-2 px-5 md:pd-20 font-bold text-lg">
        Here are some coding exercises that focus on basic physics simulations
        and animations.
      </p>
      <p className="mb-8 mt-0 px-5 md:pd-20 font-bold text-lg">
        Practicing these algorithms can help me gain a deeper understanding of
        the underlying principles.
      </p>

      <ProjectsSection />
    </div>
  );
};

export default Projects;
