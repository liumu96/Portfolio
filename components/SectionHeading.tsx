type SectionHeadingProps = {
  children: React.ReactNode;
};

const SectionHeading = ({ children }: SectionHeadingProps) => {
  return (
    <h1 className="my-10 text-center font-bold text-4xl xl:block sm:hidden hidden">
      {children}
      <hr className="w-6 h-1 mx-auto my-4 bg-purple-400 border-0 rounded"></hr>
    </h1>
  );
};

export default SectionHeading;
