import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import SectionHeading from "@/components/SectionHeading";
import PDFViewer from "@/components/PDFViewer";
import React from "react";

const About = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 md:max-w-5xl flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-10 py-8 sm:py-16 md:py-20">
      <ExperienceSection />
      <PDFViewer pdfPath="/CV_liuxing.pdf" />
    </div>
  );
};

export default About;
