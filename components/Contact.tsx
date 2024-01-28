import React from "react";
import { HiOutlineMail } from "react-icons/hi";

const Contact = () => {
  return (
    <div className="flex justify-center my-4">
      <a
        href="mailto:liuxing199604@outlook.com"
        className="w-1/6 text-neutral-100 font-semibold md:px-6 px-2 py-3 bg-purple-500 rounded shadow hover:bg-purple-700 flex items-center gap-2"
      >
        <HiOutlineMail />
        Contact Me
      </a>
    </div>
  );
};

export default Contact;
