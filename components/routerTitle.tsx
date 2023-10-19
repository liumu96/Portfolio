"use client";
import { useRouter } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";

const RouterTitle = ({ title }: { title: string }) => {
  const router = useRouter();
  return (
    <>
      <IoArrowBackOutline
        onClick={() => router.back()}
        className="cursor-pointer"
      />
      <span className="font-bold text-4xl bg-gradient-to-r from-pink-300 to-purple-400 text-transparent bg-clip-text px-6 py-3 rounded-md">
        {title}
      </span>
    </>
  );
};

export default RouterTitle;
