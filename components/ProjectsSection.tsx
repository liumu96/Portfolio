"use client";
import { BsGithub, BsArrowUpRightSquare } from "react-icons/bs";
import SlideUp from "./SlideUp";
import Link from "next/link";
import Image from "next/image";

const projects = [
  {
    name: "Ten Minutes Physics Tutorial",
    description:
      'These physics-based animation showcases was created by following the <a href="https://matthias-research.github.io/pages/tenMinutePhysics/index.html" style="color: rgb(192, 132, 252)">"Ten Minute Physics"</a> tutorial and leverages JavaScript and Three.js to implement position-based dynamics, soft body simulation, cloth simulation, fluid simulation etc. 💥',
    image: "/projects/physics-tutorial/preview.png",
    link: "/projects/physics-tutorial",
  },
  {
    name: "CSC417-Physics-based Animation",
    description:
      '<a style="color: rgb(192, 132, 252)" href="https://github.com/dilevin/CSC417-physics-based-animation">CSC417</a> introduces the underlying mathematical and algorithmic techniques required to understand and develop efficient numerical simulations of physical phenomena such as rigid bodies, deformable bodies and fluids. Here is the showcases of the course assignments implemented by C++. The assignments includes: <p>💥 1D mass-springs & 3D mass-springs </p><p> 💥 3d FEM  </p><p> 💥 Finite Elements for Cloth Simulation </p><p> 💥 Rigid Body Simulation',
    image: "/projects/CSC417/animation.gif",
    link: "/projects/fluid-simulation",
  },
  {
    name: "GAMES103-Physics-based Animation",
    description:
      'This is a Chinese course taught by <a style="color: rgb(192, 132, 252)" href="https://wanghmin.github.io/">HUAMIN WANG</a>. This course includes four area: rigid body simulation, mass-spring systems simulation, FEM-based simulation, fluid simulation. This course is a littele different from the CS417, and the assignments is implemented by C# in Unity.',
    image: "/projects/GAMES103/preview.jpeg",
    link: "/projects/fluid-simulation",
  },

  {
    name: "Rigid Body",
    description: "xxxxx",
    image: "/projects/rigid-body/bunny.png",
    link: "/projects/rigid-body",
  },
  {
    name: "Fluid Simulation",
    description: "",
    image: "/projects/fluid-2d/preview.png",
    link: "/projects/fluid-simulation",
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
