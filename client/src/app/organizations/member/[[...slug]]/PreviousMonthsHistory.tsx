import Image from "next/image";
import React from "react";

const PreviousMonthsHistory = () => {
  return (
    <div className="flex flex-col gap-4 mt-10">
      <h1 className="font-medium text-xl text-secondaryGray">
        Previous Months History
      </h1>
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center mt-4">
          <Image
            src="/calendarBg.png"
            alt="Calendar Image"
            width={800}
            height={800}
            className="w-[200px] object-contain"
          />
          <span className="text-2xl font-bold text-secondaryGray text-center mt-2">
            No History Found!
          </span>
        </div>
      </div>
    </div>
  );
};

export default PreviousMonthsHistory;
