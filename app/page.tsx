"use client";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useState } from "react";

export default function Home() {
  const [dartMode, setDarkMode] = useState(false);
  return (
    <main className="bg-white px-10 dark:bg-gray-900 md:px-20 lg:px-40 ">
      <section className="min-h-screen">
        <nav className="py-10 mb-12 flex justify-between">
          <h1 className="text-xl">Liu Xing</h1>
          <ul>
            <li>
              <BsFillMoonStarsFill
                onClick={() => setDarkMode(!dartMode)}
                className=" cursor-pointer text-2xl"
              />
            </li>
            <li>
              <a
                className="bg-gradient-to-r from-cyan-500 text- to-teal-500 text-white px-4 py-2 border-none rounded-md ml-8"
                href="#"
              >
                Resume
              </a>
            </li>
          </ul>
        </nav>
      </section>
    </main>
  );
}
