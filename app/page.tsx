import AboutSection from "@/components/AboutSection";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import BlogSection from "@/components/BlogSection";
import ModelSection from "@/components/ModelSection";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 md:max-w-5xl mb-24">
      <HeroSection />
      <AboutSection />
      {/* <ExperienceSection /> */}
      {/* <ProjectsSection />
      <BlogSection />
      <ModelSection /> */}
    </main>
  );
}
