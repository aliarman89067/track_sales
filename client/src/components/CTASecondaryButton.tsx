export const CTASecondaryButton = ({
  title,
  onClick,
}: CTASecondaryButtonProps) => {
  return (
    <div
      onClick={onClick}
      className="flex min-w-[90px] w-full h-[35px] relative group cursor-pointer"
    >
      <div className="px-4 py-2.5 w-full h-full bg-primaryGray flex items-center justify-center flex-grow shrink-0 group-hover:bg-white z-10 border group-hover:border-primaryGray transition-all duration-200 ease-in-out">
        <span className="text-center text-white flex-grow shrink-0 flex-1 font-dmSans whitespace-nowrap text-sm group-hover:text-primaryGray transition-all duration-200 ease-in-out">
          {title}
        </span>
      </div>
      <div className="absolute top-1 left-1 w-full h-full border border-primaryGray bg-transparent group-hover:bg-primaryGray z-0 transition-all duration-200 ease-in-out" />
    </div>
  );
};
