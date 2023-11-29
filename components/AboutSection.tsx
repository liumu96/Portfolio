import Image from "next/image";
import { HiOutlineMail } from "react-icons/hi";
import { PiGraduationCapLight, PiBriefcaseLight } from "react-icons/pi";

const skills = [
  { skill: "C++" },
  { skill: "Python" },
  { skill: "React" },
  { skill: "Vue" },
  { skill: "JavaScript" },
  { skill: "HTML" },
  { skill: "CSS" },
];

const languageSkills = [
  { language: "Chinese", level: "Mother language" },
  { language: "English", level: "IELTS 7.5" },
  { language: "Deutsch", level: "A2" },
  { language: "한국어", level: "TOPIK I" },
];

const otherSkills = ["Certificate of Legal Professional Qualification"];

const AboutSection = () => {
  return (
    <section id="about">
      <div className="my-8 pb-8 md:pt-16 md:pb-8">
        <h1 className="text-center font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text w-auto">
          About Me
          <hr className="w-6 h-1 mx-auto my-4 bg-purple-600 border-0 rounded"></hr>
        </h1>

        <div className="flex flex-col space-y-10 items-stretch justify-center align-top md:space-x-10 md:space-y-0 md:p-4 md:flex-row md:text-left">
          <div className="md:w-1/2 ">
            <h1 className="text-center text-2xl font-bold mb-6 md:text-left">
              Get to know me!
            </h1>
            <p className="mb-1">
              Hello, I'm LiuXing — an{" "}
              <span className="font-bold">{"ambitious"}</span>,
              <span className="font-bold">{" self-motivated"}</span>{" "}
              <span className="font-bold text-purple-400">explorer</span> with a
              background in 3D visualization, user interfaces, and web
              applications.
            </p>
            <p className="mb-1">
              My current passion lies in the captivating realm of computer
              graphics, where I'm delving deep into{" "}
              <span className="font-bold text-purple-400">
                physics-based animation and simulation
              </span>
              .This journey has fueled my ambition to pursue a Ph.D. in this
              exciting field.
            </p>
            <p className="mb-1">
              As I actively prepare for{" "}
              <span className="font-bold text-purple-400">Ph.D.</span>{" "}
              application in this exciting field. I welcome any study advice or
              information about potential opportunities. Let's connect and
              embark on this intriguing journey together.
            </p>
            <br />
            <a
              href="mailto:liuxing199604@outlook.com"
              className="w-40 text-neutral-100 font-semibold md:px-6 px-2 py-3 bg-purple-500 rounded shadow hover:bg-purple-700 flex items-center gap-2"
            >
              <HiOutlineMail />
              Contact Me
            </a>
          </div>
          <div className="text-center md:w-1/2 md:text-left">
            <h1 className="text-2xl font-bold mb-6">My Skills</h1>
            <div className="flex flex-wrap flex-row justify-center z-10 md:justify-start">
              {skills.map((item, idx) => {
                return (
                  <p
                    key={idx}
                    className="bg-gray-200 px-4 py-2 mr-2 mt-2 text-pink-400 rounded font-semibold"
                  >
                    {item.skill}
                  </p>
                );
              })}
            </div>
            <div className="flex flex-wrap flex-row justify-center z-10 md:justify-start">
              {languageSkills.map((item, idx) => {
                return (
                  <p
                    key={idx}
                    className="bg-gray-200 px-4 py-2 mr-2 mt-2 text-purple-500 rounded font-semibold"
                  >
                    {item.language}: {item.level}
                  </p>
                );
              })}
            </div>
            <div className="flex flex-wrap flex-row justify-center z-10 md:justify-start">
              {otherSkills.map((item, idx) => {
                return (
                  <p
                    key={idx}
                    className="bg-gray-200 px-4 py-2 mr-2 mt-2 text-blue-500 rounded font-semibold"
                  >
                    {item}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
