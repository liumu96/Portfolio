"use client";
import Image from "next/image";
import { Link as ScrollLink } from "react-scroll/modules";
import { HiArrowDown, HiDownload } from "react-icons/hi";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import Link from "next/link";
import {
  AiOutlineGithub,
  AiOutlineTwitter,
  AiOutlineLinkedin,
  AiOutlineYoutube,
} from "react-icons/ai";

const HeroSection = () => {
  return (
    <section id="home">
      <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-16 sm:py-32 md:py-32 md:flex-row md:space-x-4 md:text-left">
        <div className="md:mt-2 md:w-1/2">
          <Image
            src="/logo/me.jpg"
            alt=""
            width={325}
            height="325"
            className="rounded-full shadow-2xl"
          />
        </div>
        <div className="md:mt-2 md:w-3/5 text-justify">
          <h1 className="text-4xl font-bold mt-6 md:mt-0 md:text-7xl">
            Hi, I&#39;m LiuXing!
          </h1>
          {/* Frontend Developer specialized in 3D visualization and user interfaces. 
          Passionate about Computer Graphics, with a research focus on Physics-based Simulation & Visualization. 
          Currently seeking a Ph.D. position to further contribute to this field through innovative research and applications. */}
          <p className="text-lg mt-4 mb-4 md:text-2xl">
            <span className="font-semibold text-purple-500">
              Frontend Developer{" "}
            </span>
            specialized in 3D visualization and user interfaces.
          </p>
          <p className="text-lg mt-4 mb-4 md:text-2xl">
            Passionate about{" "}
            <span className="font-semibold text-purple-500">
              Computer Graphics
            </span>
            , with a research focus on{" "}
            <span className="font-semibold text-purple-500">
              Physics-based Simulation
            </span>{" "}
            &
            <span className="font-semibold text-purple-500">
              {" "}
              3D Visualization
            </span>
            .
          </p>
          <p className="text-lg mt-4 mb-8 md:text-2xl">
            Currently seeking a{" "}
            <span className="font-semibold text-purple-500">Ph.D.</span>{" "}
            position to further contribute to this field through innovative
            research and applications.
          </p>

          <div className="flex md:gap-6 gap-3 flex-row md:justify-start justify-center items-center">
            <a
              href="/liuxing_CV_en.pdf"
              className="text-neutral-100 font-semibold md:px-6 px-2 py-3 bg-purple-500 rounded shadow hover:bg-purple-700 flex items-center gap-2"
            >
              Download CV
              <HiDownload />
            </a>
            <Link
              href="/projects"
              className="text-neutral-100 font-semibold md:px-6 px-2 py-3 bg-purple-500 rounded shadow hover:bg-purple-700"
            >
              Projects
            </Link>
            <a
              href="https://github.com/liumu96"
              target="_blank"
              className="rounded-full shadow-2xl  px-2 py-2 "
            >
              <AiOutlineGithub
                size={35}
                className="hover:-translate-y-1 transition-transform cursor-pointer  dark:text-neutral-100"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center text-center justify-center">
        <ScrollLink
          to="about"
          activeClass="active"
          spy={true}
          smooth={true}
          offset={-100}
          duration={500}
        >
          <HiArrowDown size={35} className="animate-bounce" />
        </ScrollLink>
      </div>
    </section>
  );
};

export default HeroSection;
