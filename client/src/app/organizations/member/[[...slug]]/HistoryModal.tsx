import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ClientRow } from "./ClientRow";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  history: {
    id: string;
    memberId: string;
    year: number;
    month: string;
    target: string;
    totalSales: string;
    status: "Not_Achieved" | "Achieved";
    sales: Sales[];
  } | null;
  targetCurrency: string;
}

const HistoryModal = ({
  isOpen,
  setIsOpen,
  history,
  targetCurrency,
}: Props) => {
  if (!history) return;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[400px] sm:min-w-[500px] md:min-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            History of {history.month} {history.year}
          </DialogTitle>
          <div className="flex justify-between w-full flex-wrap pt-3">
            <div className="flex flex-col">
              <span className="text-primaryGray font-semibold text-lg">
                Status
              </span>
              <span
                className={cn(
                  "font-medium text-lg",
                  history.status === "Achieved"
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                {history.status === "Achieved" ? "Achieved" : "Not Achieved"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-primaryGray font-semibold text-lg">
                Target
              </span>
              <span className="text-secondaryGray font-medium text-lg">
                {history.target}
                {targetCurrency}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-primaryGray font-semibold text-lg">
                Total Sales
              </span>
              <span className="text-secondaryGray font-medium text-lg">
                {history.sales.reduce(
                  (sum, acc) => sum + Number(acc.totalPayment),
                  0
                )}
                {targetCurrency}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-primaryGray font-semibold text-lg">
                Total Clients
              </span>
              <span className="text-secondaryGray font-medium text-lg">
                {history.sales.length}
              </span>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col mt-4 gap-3">
          <h1 className="font-bold text-primaryGray text-lg">Client List</h1>
          <div className="flex flex-col gap-2 h-[350px] overflow-y-scroll">
            {history.sales.map((sale, index) => (
              <ClientRow
                key={index}
                sale={sale}
                targetCurrency={targetCurrency}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
