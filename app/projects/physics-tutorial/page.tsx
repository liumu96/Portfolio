"use client";
import Image from "next/image";
import Link from "next/link";
import RouterTitle from "@/components/routerTitle";

const physicsDemos = [
  {
    title: "Ball-2D",
    descrition: "",
    youtube: "",
    noteLink: "",
    github: "",
    link: "/projects/physics-tutorial/ball-2d",
    previewImage: "/projects/physics-tutorial/ball-2d.gif",
  },
  {
    title: "Ball-3D",
    link: "/projects/physics-tutorial/ball-3d",
    previewImage: "/projects/physics-tutorial/ball-3d.gif",
  },
  {
    title: "Billiard",
    link: "/projects/physics-tutorial/billiard",
    previewImage: "/projects/physics-tutorial/billiard.gif",
  },
  {
    title: "Bead",
    link: "/projects/physics-tutorial/bead",
    previewImage: "/projects/physics-tutorial/bead.gif",
  },
  {
    title: "Many Beads",
    link: "/projects/physics-tutorial/beads",
    previewImage: "/projects/physics-tutorial/beads.gif",
  },
  {
    title: "Pendulum",
    link: "/projects/physics-tutorial/pendulum",
    previewImage: "/projects/physics-tutorial/pendulum.gif",
  },
  {
    title: "Ball 3D - Interaction",
    link: "/projects/physics-tutorial/ball-3d-interact",
    previewImage: "/projects/physics-tutorial/ball-interaction.gif",
  },
  {
    title: "Soft Bodies",
    link: "/projects/physics-tutorial/soft-bodies",
    previewImage: "/projects/physics-tutorial/soft-bunny.gif",
  },
  {
    title: "Spatial Hashing",
    link: "/projects/physics-tutorial/spatial-hashing",
    previewImage: "/projects/physics-tutorial/spatial-hashing.gif",
  },
  {
    title: "Soft Body Skinning",
    link: "/projects/physics-tutorial/soft-body-skinning",
    previewImage: "/projects/physics-tutorial/soft-dragon.gif",
  },
  {
    title: "Cloth Simulation",
    link: "/projects/physics-tutorial/cloth-simulation",
    previewImage: "/projects/physics-tutorial/cloth-simulation.gif",
  },
  {
    title: "Self Collisions",
    link: "/projects/physics-tutorial/cloth-self-collision",
    previewImage: "/projects/physics-tutorial/self-collision.gif",
  },
  {
    title: "Eulerian Smoke Simulation",
    link: "/projects/physics-tutorial/eulerian-smoke-sim",
    previewImage: "/projects/physics-tutorial/smoke-simulation.gif",
  },
  {
    title: "FLIP Fluid Simulation",
    link: "/projects/physics-tutorial/flip-fluid-simulation",
    previewImage: "/projects/physics-tutorial/flip-fluid.gif",
  },
  {
    title: "Height-Field Water Simulation",
    link: "/projects/physics-tutorial/height-field-water",
    previewImage: "/projects/physics-tutorial/height-field.gif",
  },
];

const PhysicsTutorial = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-24 md:py-20 sm:px-8 px-8">
      <RouterTitle title="Physics Tutorial" />
      <span className="mb-8 mt-2">
        This project, inspired by{" "}
        <span className="font-bold">Matthias Müller's</span>{" "}
        <a
          href="https://matthias-research.github.io/pages/tenMinutePhysics/index.html"
          className="text-purple-400"
        >
          Ten Minute Physics
        </a>{" "}
        tutorial, focuses on physically based simulation concepts like{" "}
        <p className="text-purple-400">
          position-based dynamics, soft body simulation, cloth simulation, and
          fluid simulation.
        </p>
        {/* <p>
          While the original code was in HTML, I've taken it a step further by
          implementing these demos in modular form.
        </p>{" "} */}
        {/* Explore these hands-on projects to witness how I've translated the
        concepts into real-world applications. Each demo is a testament to my
        dedication and expertise in physics-based animation and simulation. */}
      </span>
      <div className="w-full grid gap-10 md:gap-6 md:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-10">
        {physicsDemos.map((demo, idx) => {
          return (
            <div
              key={idx}
              className="flex flex-col justify-center items-center"
            >
              <Link href={demo.link || "/projects/physics-tutorial"}>
                <Image
                  src={demo.previewImage}
                  alt=""
                  width={300}
                  height={200}
                  className="shadow-2xl mb-2 rounded border border-purple-300"
                />
              </Link>

              <div>{demo.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhysicsTutorial;
