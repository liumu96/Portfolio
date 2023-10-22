"use client";
import SectionHeading from "./SectionHeading";
import { PiGraduationCap } from "react-icons/pi";
import { IoIosSchool } from "react-icons/io";
import React from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

const experienceData = [
  {
    title: "NUAA",
    location: "Nanjing, China",
    description: "B.S. in Microelectronics ",
    GPA: "GPA: (3.9/5.0) Ranking: 1/27",
    icon: <Image src="/experience/nuaa.png" alt="img" height={80} width={80} />,
    date: "2012.09-2016.06",
    age: 16,
  },
  {
    title: "NUDT",
    location: "Changsha, China",
    description: "M.S. in Electronic Science and Technology",
    GPA: "GPA: (3.5/4.0) No Ranking",
    icon: (
      <Image
        src="/experience/nudt.png"
        alt="img"
        height={80}
        width={80}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
      />
    ),
    date: "2016.09-2018.12",
    age: 20,
  },
  {
    title: "SF Tech",
    location: "Shenzhen, China",
    position: "Frontend Developer",
    description:
      "Developed SF Freight Logistics Hub's first inaugural 3D application, establishing a groundbreaking precedent in SF Tech. ",
    icon: (
      <Image
        src="/experience/SFTech.png"
        alt="img"
        height={60}
        width={60}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
      />
    ),
    date: "2019.03-2021.05",
    age: 23,
  },
  {
    title: "Tencent Tech",
    location: "Shenzhen, China",
    position: "Frontend Developer",
    description:
      "Responsible for leading the development of digital twin tools and applications for data centers. ",
    icon: (
      <Image
        src="/experience/TX.png"
        alt="img"
        height={30}
        width={30}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      />
    ),
    date: "2021.06-2023.04",
    age: 25,
  },
  {
    title: "Independent Learner",
    location: "Xiamen, China",
    description:
      "I'm preparing for a PHD application, immersing myself in compter graphics fundamental, programming languages(c++, c#), 3D tools(unity, blender).I'm trying to implement some interesting projects to demonstrate my passion for the field.",

    // icon: React.createElement(IoIosSchool),
    icon: (
      <Image
        src="/experience/work1.jpeg"
        alt="img"
        height={80}
        width={80}
        className="absolute top-1/2 left-1/2 -translate-y-8 -translate-x-1/2 rounded-full"
      />
    ),
    date: "2023.4-present",
    age: 27,
  },
];

const ExperienceSection = () => {
  const { theme } = useTheme();

  return (
    <div className="my-12 pb-8 md:pt-16 md:pb-8">
      <h1 className="text-center font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text w-auto">
        My Experience
        <hr className="w-6 h-1 mx-auto my-4 bg-purple-600 border-0 rounded"></hr>
      </h1>
      <VerticalTimeline lineColor="">
        {experienceData.map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              <VerticalTimelineElement
                contentStyle={{
                  background: "rgb(256, 256, 256)",
                  boxShadow: "none",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  textAlign: "left",
                  padding: "0.5rem 0.5rem",
                  color: "rgb(168, 85, 247)",
                }}
                style={{ visibility: "visible" }}
                contentArrowStyle={{
                  borderRight: "7px solid rgb(229, 231, 235)",
                }}
                date={item.date}
                icon={item.icon}
                iconStyle={{
                  background: theme === "light" ? "white" : "white",
                  // fontSize: "1.5rem",
                }}
              >
                <h3 className="font-semibold capitalize text-black">
                  {item.title}
                </h3>
                <p className="font-normal !mt-0 text-black">{item.location}</p>
                <p className="!mt-1 !font-normal text-black">
                  {item.description}
                </p>
                {item.GPA && (
                  <p className="!mt-1 !font-normal text-black">{item.GPA}</p>
                )}
              </VerticalTimelineElement>
            </React.Fragment>
          );
        })}
      </VerticalTimeline>
    </div>
  );
};

export default ExperienceSection;
