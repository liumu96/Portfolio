"use client";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import NavBar from "./pages/NavBar/index";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// todo custom the theme color style
const darkTheme = createTheme({
  type: "dark", // it could be "light" or "dark"
  theme: {
    colors: {
      primary: "#4ADE7B",
      secondary: "#F9CB80",
      error: "#FCC5D8",
    },
  },
});

const lightTheme = createTheme({
  type: "light",
  theme: {
    colors: {
      primary: "#4ADE7B",
      secondary: "#F9CB80",
      error: "#FCC5D8",
    },
  },
});

export default function Home() {
  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider>
        <main className="bg-white px-10 md:px-20 lg:px-40 ">
          <section className="min-h-screen">
            <NavBar />
            <div className="text-center p-10 py-10">
              <h2>Liu Xing</h2>
            </div>
          </section>
        </main>
      </NextUIProvider>
    </NextThemesProvider>
  );
}
