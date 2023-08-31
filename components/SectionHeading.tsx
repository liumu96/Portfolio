type SectionHeadingProps = {
  children: React.ReactNode;
};

const SectionHeading = ({ children }: SectionHeadingProps) => {
  return (
    <h1 className="my-10 text-center font-bold text-4xl">
      {children}
      <hr className="w-6 h-1 mx-auto my-4 bg-blue-500 border-0 rounded"></hr>
    </h1>
  );
};

export default SectionHeading;
