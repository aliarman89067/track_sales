"use client";
import { CTAPrimaryButton } from "@/components/CTAPrimaryButton";
import { ChartColumnIncreasing, Clock, MousePointer } from "lucide-react";
import Image from "next/image";

export const DetailsSection = () => {
  return (
    <section className="w-full h-full py-10 px-5 flex items-center justify-center bg-brand-100/20 mt-10">
      <div className="max-w-screen-xl w-full mx-auto h-[500px] flex items-center justify-between gap-10">
        {/* Left Section */}
        <div className="flex-1 lg:flex-[1.3] flex flex-col gap-2 w-full items-center lg:items-start">
          <h1 className="text-center lg:text-start font-semibold text-primaryGray text-3xl md:text-4xl">
            Discover the powerful features that elevate your sales tracking
            experience.
          </h1>
          <p className="text-center lg:text-start text-secondaryGray text-base w-[90%]">
            Our platform offers real-time tracking to keep you updated on sales
            performance. With intuitive performance analytics, you can make
            informed decisions to boost your team's success.
          </p>
          <div className="max-w-xl lg:w-full flex gap-4 justify-between">
            <div className="items-center sm:items-start flex flex-col gap-1">
              <Clock className="size-8 text-primaryGray" />
              <h1 className="text-primaryGray font-bold text-lg md:text-xl">
                Real-Time Tracking
              </h1>
              <p className="text-secondaryGray text-base md:text-lg mt-1 text-center sm:text-start">
                Stay informed with instant updates on your sales agents'
                activities and achievements.
              </p>
            </div>
            <div className="items-center sm:items-start flex flex-col gap-1">
              <ChartColumnIncreasing className="size-8 text-primaryGray" />
              <h1 className="text-primaryGray font-bold text-lg md:text-xl">
                Performance Analytics
              </h1>
              <p className="text-secondaryGray text-base md:text-lg mt-1 text-center sm:text-start">
                Analyze trends and optimize strategies with our comprehensive
                analytics tools.
              </p>
            </div>
          </div>
          <CTAPrimaryButton
            title="Start Now"
            onClick={() => {}}
            classNames="w-[80%] lg:w-[60%] mt-6"
          />
        </div>
        <div className="hidden lg:flex flex-1 h-full">
          <div className="w-full h-full flex-1 flex items-center justify-center relative">
            <div className="absolute top-10 right-12 rounded-lg bg-brand-200/50 backdrop-blur-sm flex items-center justify-center py-3 w-[240px] z-20">
              <p className="text-white text-base text-center italic">
                Create System That <br /> Works!
              </p>
              <MousePointer className="absolute -bottom-6 -right-5 text-white size-5" />
            </div>
            <div className="absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-r from-transparent to-black/50 z-10" />
            <Image
              src="/detailsSectionGirl.jpg"
              alt="Details Section Girl Image"
              fill
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
