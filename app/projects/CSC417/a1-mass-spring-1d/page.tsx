import RouterTitle from "@/components/routerTitle";
import { AiOutlineGithub } from "react-icons/ai";
import Image from "next/image";

const page = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 my-6 pt-6 sm:pt-24 md:pt-20 sm:px-8 px-8">
      <RouterTitle title="1D Mass Spring " />
      <p className="flex items-center">
        Here only display the simulator results, more details in{" "}
        <a
          href="https://github.com/liumu96/CSC417-homeworks/tree/main/a1-mass-spring-1d"
          target="_blank"
          className="rounded-full shadow-2xl px-2 py-2"
        >
          <AiOutlineGithub
            size={25}
            className="hover:-translate-y-1 transition-transform cursor-pointer dark:text-neutral-100 rounded border border-purple-300"
          />
        </a>
      </p>
      <div className="grid gap-10 md:gap-2 md:grid-cols-2 sm:gap-2 lg:grid-cols-2 lg:gap-10">
        <div className="flex-col justify-around items-center">
          <h1 className="font-bold">Forward-Euler</h1>
          <Image
            src="/projects/CSC417/a1-mass-spring-1d/forward-euler.gif"
            alt=""
            width={300}
            height={200}
            className="shadow-2xl mb-2 rounded border "
          />
          <Image
            src="/projects/CSC417/a1-mass-spring-1d/phase-fe.gif"
            alt=""
            width={300}
            height={200}
            className="shadow-2xl mb-2 rounded border "
          />
        </div>

        <div className="flex-col justify-around items-center">
          <h1 className="font-bold">Backward-Euler</h1>
          <Image
            src="/projects/CSC417/a1-mass-spring-1d/backward-euler.gif"
            alt=""
            width={300}
            height={200}
            className="shadow-2xl mb-2 rounded border"
          />
          <Image
            src="/projects/CSC417/a1-mass-spring-1d/phase-be.gif"
            alt=""
            width={300}
            height={200}
            className="shadow-2xl mb-2 rounded border"
          />
        </div>

        <div className="flex-col justify-around items-center">
          <h1 className="font-bold">Symplectic-Euler</h1>
          <Image
            src="/projects/CSC417/a1-mass-spring-1d/symplectic-euler.gif"
            alt=""
            width={300}
            height={200}
            className="shadow-2xl mb-2 rounded border"
          />
          <Image
            src="/projects/CSC417/a1-mass-spring-1d/phase-se.gif"
            alt=""
            width={300}
            height={200}
            className="shadow-2xl mb-2 rounded border"
          />
        </div>

        <div className="flex-col justify-around items-center">
          <h1 className="font-bold">Runge-Kutta</h1>
          <Image
            src="/projects/CSC417/a1-mass-spring-1d/runge-kutta.gif"
            alt=""
            width={300}
            height={200}
            className="shadow-2xl mb-2 rounded border"
          />
          <Image
            src="/projects/CSC417/a1-mass-spring-1d/phase-rk.gif"
            alt=""
            width={300}
            height={200}
            className="shadow-2xl mb-2 rounded border"
          />
        </div>
      </div>
    </div>
  );
};

export default page;
