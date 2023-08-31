"use client";
import Image from "next/image";
import { Link } from "react-scroll/modules";
import { HiArrowDown, HiDownload } from "react-icons/hi";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import {
  AiOutlineGithub,
  AiOutlineTwitter,
  AiOutlineLinkedin,
  AiOutlineYoutube,
} from "react-icons/ai";

const HeroSection = () => {
  return (
    <section id="home">
      <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-16 sm:py-32 md:py-48 md:flex-row md:space-x-4 md:text-left">
        <div className="md:mt-2 md:w-1/2">
          <Image
            src="/work1.jpeg"
            alt=""
            width={325}
            height="325"
            className="rounded-full shadow-2xl"
          />
        </div>
        <div className="md:mt-2 md:w-3/5">
          <h1 className="text-4xl font-bold mt-6 md:mt-0 md:text-7xl">
            Hi, I&#39;m LiuXing!
          </h1>
          <p className="text-lg mt-4 mb-6 md:text-2xl">
            I used to be a{" "}
            <span className="font-semibold text-blue-600">
              Frontend Developer
            </span>
            . I develop 3D visuals, user interfaces and web applications
          </p>
          <p className="text-lg mt-4 mb-6 md:text-2xl">
            Now I'm a{" "}
            <span className="font-semibold text-blue-600">Freelancer</span>!
          </p>
          <p className="text-lg mt-4 mb-12 md:text-2xl">
            I'm looking for a PHD position in Computer Graphics. My research
            interest is{" "}
            <span className="font-semibold text-blue-600">
              Physics Animation and Simulation.
            </span>
          </p>
          <div className="flex gap-6 flex-row justify-start items-center">
            <a
              href="/CV.pdf"
              className="text-neutral-100 font-semibold px-6 py-3 bg-blue-600 rounded shadow hover:bg-blue-700 flex items-center gap-2"
            >
              Download CV
              <HiDownload />
            </a>

            <Link
              to="projects"
              activeClass="active"
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
              className="text-neutral-100 font-semibold px-6 py-3 bg-blue-600 rounded shadow hover:bg-blue-700"
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
        <Link
          to="about"
          activeClass="active"
          spy={true}
          smooth={true}
          offset={-100}
          duration={500}
        >
          <HiArrowDown size={35} className="animate-bounce" />
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;