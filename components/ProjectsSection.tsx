"use client";
import { BsGithub, BsArrowUpRightSquare } from "react-icons/bs";
import SlideUp from "./SlideUp";
import Link from "next/link";
import Image from "next/image";

const projects = [
  {
    name: "Ten Minutes Physics Tutorial",
    description:
      'This project, inspired by Matthias Müller\'s <a href="https://matthias-research.github.io/pages/tenMinutePhysics/index.html" style="color: rgb(192, 132, 252)">"Ten Minutes Physics"</a> tutorial, focuses on physically based simulation concepts like <span style="color: rgb(192, 132, 252)">position-based dynamics, soft body simulation, cloth simulation, and fluid simulation</span>. While Müller used JavaScript, I enhanced the implementation by using the <span style="color: rgb(192, 132, 252)">React</span> module, deepening my understanding of these concepts and honing my coding skills.',
    image: "/projects/physics-tutorial/preview.png",
    link: "/projects/physics-tutorial",
  },
  {
    name: "GAMES103-Physics-based Animation",
    description:
      'This project is based on GAMES103, a Chinese course taught by <a style="color: rgb(192, 132, 252)" href="https://wanghmin.github.io/">HUAMIN WANG</a>. The course covers four areas: rigid body simulation, mass-spring systems, FEM-based simulation, and fluid simulation. It differs from CSC417 and involves implementing assignments using <span style="color: rgb(192, 132, 252)">C#</span> in Unity. I\'ve also exported the project as a <span style="color: rgb(192, 132, 252)">WebGL</span> build, allowing for web-based interaction.',
    image: "/projects/GAMES103/cloth.gif",
    link: "/projects/GAMES103",
  },
  {
    name: "CSC417-Physics-based Animation",
    description:
      'This project is part of <a style="color: rgb(192, 132, 252)" href="https://github.com/dilevin/CSC417-physics-based-animation">CSC417</a>, a fundamental course covering mathematical and algorithmic techniques for numerical simulations of physical phenomena like rigid bodies, deformable bodies, and fluids. The showcase includes four assignments implemented in <span style="color: rgb(192, 132, 252)">C++</span> on topics:<p>💥 1D mass-springs & 3D mass-springs </p><p> 💥 3d FEM  </p><p> 💥 Finite Elements for Cloth Simulation </p><p> 💥 Rigid Body Simulation.',
    image: "/projects/CSC417/animation.gif",
    link: "/projects/CSC417",
  },
  // {
  //   name: "Fluid Simulation",
  //   description: "Uncompleted",
  //   image: "/projects/fluid-2d/preview.png",
  //   link: "/projects/fluid-simulation",
  // },
  {
    name: "Physics-based Animation",
    description: "Uncompleted",
    image: "/projects/GAMES103/preview.jpeg",
    link: "/projects/physics-based-animation",
  },
];

const ProjectsSection = () => {
  return (
    <div className="flex flex-col space-y-16 px-5 md:px-20">
      {projects.map((project, idx) => {
        return (
          <div key={idx}>
            <SlideUp offset="-10px 0px -10px 0px">
              <div className="flex flex-col  animate-slideUpCubiBezier animation-delay-2 md:flex-row md:space-x-12">
                <div className=" md:w-1/2">
                  <Link href={project.link}>
                    <Image
                      src={project.image}
                      alt=""
                      width={1000}
                      height={1000}
                      className="rounded-xl shadow-xl hover:opacity-70"
                    />
                  </Link>
                </div>
                <div className="mt-0 md:w-1/2">
                  <h1 className="text-4xl font-bold mb-6">{project.name}</h1>
                  <p
                    className=" leading-7  text-left"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  ></p>
                  {/* <div className="flex flex-row align-bottom space-x-4">
                    <Link href={project.github} target="_blank">
                      <BsGithub
                        size={30}
                        className="hover:-translate-y-1 transition-transform cursor-pointer"
                      />
                    </Link>
                    <Link href={project.link} target="_blank">
                      <BsArrowUpRightSquare
                        size={30}
                        className="hover:-translate-y-1 transition-transform cursor-pointer"
                      />
                    </Link>
                  </div> */}
                </div>
              </div>
            </SlideUp>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsSection;
