"use client";
import SectionHeading from "./SectionHeading";
import { PiGraduationCap } from "react-icons/pi";
import React from "react";
import { useTheme } from "next-themes";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

const experienceData = [
  {
    title: "NUAA",
    location: "Nanjing, China",
    description: "B.S. in Microelectronics / GPA:  (3.9/5.0) Ranking: 1/27",
    icon: React.createElement(PiGraduationCap),
    date: "2012.09-2016.06",
    age: 16,
  },
  {
    title: "NUDT",
    location: "Changsha, China",
    description: "M.S. in Electronic Science and Technology",
    icon: React.createElement(PiGraduationCap),
    date: "2016.09-2018.12",
    age: 20,
  },
  {
    title: "SF Tech",
    location: "Shenzhen, China",
    description:
      "Developed the inaugural 3D Application of  SF Freight logistics hub, establishing a groundbreaking precedent within SF Tech. It’s the first 3D app in SF Tech. This digital twin platform harnesses AI and simulation technology to enable advanced logistics operation scheduling and early-warning capabilities, showcasing novel approach to industry standards.",
    icon: React.createElement(PiGraduationCap),
    date: "2019.03-2021.05",
    age: 23,
  },
  {
    title: "Tencent",
    location: "Shenzhen, China",
    description:
      "Responsible for leading the development of digital twin tools and webpages for data centers. This involves creating a tool for building digital twin scenes and designing 3D + 2D graphics webpages, covering various scenarios like HVAC, electricity, monitoring, and access control, etc. The goal is to improve data center management and efficiency through innovative digital twin technology.",
    icon: React.createElement(PiGraduationCap),
    date: "2021.06-2023.04",
    age: 25,
  },
  {
    title: "Freelancer",
    location: "Xiamen, China",
    description:
      "Now I'm preparing for PHD application! I learn compter graphics fundamental, programming languages(c++, python), 3D tools(unity, blender), and try to implement some interesting projects.",
    icon: React.createElement(PiGraduationCap),
    date: "2023.4-present",
    age: 27,
  },
];

const ExperienceSection = () => {
  const { theme } = useTheme();

  return (
    <section id="experience">
      <SectionHeading>Experience</SectionHeading>
      <VerticalTimeline lineColor="">
        {experienceData.map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              <VerticalTimelineElement
                contentStyle={{
                  background: "rgb(229, 231, 235)",
                  boxShadow: "none",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  textAlign: "left",
                  padding: "0.5rem 0.5rem",
                  color: "rgb(107, 114, 128)",
                }}
                contentArrowStyle={{
                  borderRight: "7px solid  rgb(229, 231, 235)",
                }}
                date={item.date}
                icon={<PiGraduationCap color={"black"} />}
                iconStyle={{
                  background: theme === "light" ? "white" : "white",
                  fontSize: "1.5rem",
                }}
              >
                <h3 className="font-semibold capitalize text-gray-500">
                  {item.title}
                </h3>
                <p className="font-normal !mt-0 text-gray-500">
                  {item.location}
                </p>
                <p className="!mt-1 !font-normal text-gray-500">
                  {item.description}
                </p>
              </VerticalTimelineElement>
            </React.Fragment>
          );
        })}
      </VerticalTimeline>
    </section>
  );
};

export default ExperienceSection;
