import Image from "next/image";
import { PiGraduationCapLight, PiBriefcaseLight } from "react-icons/pi";
import ExperienceSection from "./ExperienceSection";

const skills = [
  { skill: "C++" },
  { skill: "Python" },
  { skill: "React" },
  { skill: "Vue" },
  { skill: "JavaScript" },
  { skill: "HTML" },
  { skill: "CSS" },
  { skill: "Git" },
];

const languageSkills = [
  { language: "Chinese", level: "mother language" },
  { language: "English", level: "IELTS 7.5" },
  { language: "한국어", level: "Basic" },
  { language: "Deutsch", level: "Basic" },
];

const AboutSection = () => {
  return (
    <section id="about">
      <div className="my-12 pb-12 md:pt-16 md:pb-48">
        <h1 className="text-center font-bold text-4xl">
          About Me
          <hr className="w-6 h-1 mx-auto my-4 bg-blue-500 border-0 rounded"></hr>
        </h1>

        <div className="flex flex-col space-y-10 items-stretch justify-center align-top md:space-x-10 md:space-y-0 md:p-4 md:flex-row md:text-left">
          <div className="md:w-1/2 ">
            <h1 className="text-center text-2xl font-bold mb-6 md:text-left">
              Get to know me!
            </h1>
            <p>
              Hi, my name is LiuXing and I am a{" "}
              <span className="font-bold">{"highly ambitious"}</span>,
              <span className="font-bold">{" self-motivated"}</span>, and
              <span className="font-bold">{" driven"}</span>{" "}
              <span className="font-bold text-blue-500">explorer</span>.
            </p>
            <br />
            <p>
              I got my BS from NUAA in 2016 and then I went into NUDT, where I
              got my MS degree. After graduated from NUDT with a MS in
              Electronic Science and Technology,
            </p>
            <br />
            <p>I have a deep passion for computer graphics.</p>
            <br />
            <p></p>
          </div>
          <div className="text-center md:w-1/2 md:text-left">
            <h1 className="text-2xl font-bold mb-6">My Skills</h1>
            <div className="flex flex-wrap flex-row justify-center z-10 md:justify-start">
              {skills.map((item, idx) => {
                return (
                  <p
                    key={idx}
                    className="bg-gray-200 px-4 py-2 mr-2 mt-2 text-gray-500 rounded font-semibold"
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
                    className="bg-gray-200 px-4 py-2 mr-2 mt-2 text-gray-500 rounded font-semibold"
                  >
                    {item.language}:{item.level}
                  </p>
                );
              })}
            </div>
            <Image
              src="/work3.jpeg"
              alt=""
              width={325}
              height={325}
              className="hidden md:block md:relative md:top-8 md:left-0 md:z-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
