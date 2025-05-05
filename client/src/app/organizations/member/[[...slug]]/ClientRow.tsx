import Image from "next/image";

import { ArrowUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface props {
  sale: Sales;
  memberData: AgentSheetProps["memberData"];
}

export const ClientRow = ({ sale, memberData }: props) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-secondaryGray bg-white hover:bg-gray-200 transition-colors duration-150 ease-linear">
      {/* Client Image */}
      <div className="py-1 flex flex-grow shrink-0">
        <Image
          src={sale.clientImageUrl}
          alt={`${sale.clientName} image`}
          width={200}
          height={200}
          className="w-16 h-16 object-cover rounded-full"
        />
      </div>
      {/* Client Name */}
      <div className="flex flex-col h-full w-full justify-center border-l border-secondaryGray text-center">
        <div className="text-center flex items-center justify-center h-full px-4">
          <span className="font-semibold text-base text-primaryGray">Name</span>
        </div>
        <div className="h-[1px] w-full bg-secondaryGray" />
        <div className="text-center flex items-center justify-center h-full px-4">
          <span className="font-medium text-base text-secondaryGray">
            {sale.clientName.substring(0, 6)}
          </span>
        </div>
      </div>
      {/* Client Name */}
      <div className="flex flex-col h-full w-full justify-center border-l border-secondaryGray text-center">
        <div className="text-center flex items-center justify-center h-full px-4">
          <span className="font-semibold text-base text-primaryGray">
            Email
          </span>
        </div>
        <div className="h-[1px] w-full bg-secondaryGray" />
        <div className="text-center flex items-center justify-center h-full px-4">
          <span className="font-medium text-base text-secondaryGray">
            {sale.clientEmail.substring(0, 10)}
          </span>
        </div>
      </div>
      {/* Client Amount */}
      <div className="flex flex-col h-full w-full justify-center border-l border-secondaryGray text-center">
        <div className="text-center flex items-center justify-center h-full px-4">
          <span className="font-semibold text-base text-primaryGray">Date</span>
        </div>
        <div className="h-[1px] w-full bg-secondaryGray" />
        <div className="text-center flex items-center justify-center h-full px-4">
          <span className="font-medium text-base text-secondaryGray">
            {sale.totalPayment}
            {memberData.targetCurrency}
          </span>
        </div>
      </div>
      {/* See full detail */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="group flex h-full px-3 flex-grow shrink-0 items-center justify-center border-l border-secondaryGray cursor-pointer">
            <ArrowUp className="size-5 text-brand-500 rotate-45 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-150 ease-linear" />
          </div>
        </DialogTrigger>
        <DialogContent className="min-w-[600px]">
          <DialogHeader>
            <DialogTitle>{sale.clientName} Details</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col mt-4">
            <div className="flex items-center gap-3">
              <Image
                src={sale.clientImageUrl}
                alt={`${sale.clientName} image`}
                width={500}
                height={500}
                className="w-[70px] h-[70px] rounded-full"
              />
              <div className="flex flex-col gap-0.5">
                <h2 className="font-semibold text-primaryGray text-lg">
                  {sale.clientName}
                </h2>
                <span className="font-medium text-secondaryGray text-base">
                  {sale.clientEmail}
                </span>
                <span className="font-medium text-secondaryGray text-base">
                  Phone Number:{" "}
                  {sale.clientPhoneNumber ? sale.clientPhoneNumber : "--"}
                </span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3">
              <div className="flex flex-col gap-0.5 items-center">
                <span className="font-semibold text-lg text-primaryGray">
                  Total Amount
                </span>
                <span className="font-medium text-lg text-secondaryGray">
                  {sale.totalPayment}
                  {memberData.targetCurrency}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 items-center">
                <span className="font-semibold text-lg text-primaryGray">
                  Paid Amount
                </span>
                <span className="font-medium text-lg text-secondaryGray">
                  {sale.paidAmount}
                  {memberData.targetCurrency}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 items-center">
                <span className="font-semibold text-lg text-primaryGray">
                  Remaining Amount
                </span>
                <span className="font-medium text-lg text-secondaryGray">
                  {sale.remainingAmount}
                  {memberData.targetCurrency}
                </span>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <span className="font-semibold text-lg text-primaryGray">
                Description
              </span>
              <p className="font-medium text-lg text-secondaryGray">
                {sale.description ? sale.description : "--"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
