import { NAVBAR_HEIGHT } from "@/constant/values";
import Image from "next/image";
import { CTAPrimaryButton } from "./CTAPrimaryButton";

export const EmptyPaperPlaneCTA = ({
  title,
  onClick,
}: EmptyPaperPlaneCTAProps) => {
  return (
    <div
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
      className="flex w-full items-center justify-center"
    >
      <div className="flex flex-col items-center justify-between gap-4">
        <Image
          src="/paperPlane.png"
          alt="Paper Plane Image For Empty Organization"
          width={500}
          height={500}
          className="w-[350px] height-[350px] object-contain"
        />
        <CTAPrimaryButton
          title={title}
          onClick={onClick}
          classNames="bg-primaryGray ring-primaryGray w-[450px]"
        />
      </div>
    </div>
  );
};
