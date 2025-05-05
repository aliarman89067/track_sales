"use client";

import { CTAPrimaryButton } from "@/components/CTAPrimaryButton";
import { GuideGrid } from "./GuideGrid";

export const Header = () => {
  return (
    <header className="mt-16 w-full xl:max-w-screen-lg mx-auto max-xl:px-5">
      <div className="flex flex-col gap-2 w-full items-center justify-center">
        <span className="w-full sm:w-[90%] md:w-[80%] lg:w-[80%] xl:w-[70%]">
          <h1 className="text-center font-black text-primaryGray text-4xl sm:text-5xl md:text-6xl leading-[45px] md:leading-[60px]">
            Track Sales Performance with Modern Way
          </h1>
        </span>
        <span className="w-full sm:w-[80%] md:w-[70%] lg:w-[70%] xl:w-[60%] mt-2">
          <p className="text-center text-secondaryGray text-base">
            Experience a cutting-edge web app designed for sales agents. Monitor
            performance, set targets, and achieve success with ease.
          </p>
        </span>
      </div>
      <CTAPrimaryButton
        title="Get Started"
        onClick={() => {}}
        classNames="w-[350px] sm:w-[450px] mx-auto mt-8"
      />
      <GuideGrid />
    </header>
  );
};
