import { HEADER_GRID } from "@/constant/data";
import { motion } from "framer-motion";

export const GuideGrid = () => {
  const getVariants = (index: number) => {
    return {
      initial: { right: 0, top: "0%" },
      animate: {
        right:
          index === 0
            ? ["0%", "100%", "100%", "0%", "0%"]
            : index === 1
            ? ["100%", "0%", "0%", "100%", "100%"]
            : index === 2
            ? ["0%", "100%", "100%", "0%", "0%"]
            : ["100%", "0%", "0%", "100%", "100%"],
        top:
          index === 0
            ? ["0%", "0%", "-100%", "-100%", "0%"]
            : index === 1
            ? ["0%", "0%", "-100%", "-100%", "0%"]
            : index === 2
            ? ["-100%", "-100%", "0%", "0%", "-100%"]
            : ["-100%", "-100%", "0%", "0%", "-100%"],

        transition: {
          duration: 10,
          ease: "linear",
          times: [0, 0.33, 0.66, 1],
          repeat: Infinity,
        },
      },
    };
  };
  return (
    <div className="w-[80%] mx-auto mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full h-full">
        {HEADER_GRID.map((item) => {
          return (
            <div
              key={item.id}
              className="relative w-full bg-secondaryGray rounded-lg p-[2px] overflow-hidden"
            >
              <div className="relative w-full h-full px-4 py-5 rounded-lg bg-white z-10">
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="text-primaryGray font-medium text-base text-center">
                    {item.text}
                  </p>
                  <div className="w-11 h-11 rounded-full bg-primaryGray flex items-center justify-center">
                    <item.icon className="size-5 text-white" />
                  </div>
                </div>
              </div>
              <motion.div
                variants={getVariants(item.id)}
                initial="initial"
                animate="animate"
                className="absolute w-[150px] h-[150px] transform translate-x-[75px] translate-y-[75px] rounded-full custom-gradient "
              ></motion.div>
            </div>
          );
        })}
        <div></div>
      </div>
    </div>
  );
};
