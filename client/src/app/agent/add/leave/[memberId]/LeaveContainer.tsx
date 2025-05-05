"use client";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
  useAddLeaveMutation,
  useGetAuthUserQuery,
  useGetMemberQuery,
} from "@/state/api";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  memberId: string;
}

export const LeaveContainer = ({ memberId }: Props) => {
  const router = useRouter();

  const [leave, setLeave] = useState("");

  const {
    data: authData,
    isLoading: isAuthLoading,
    error: authError,
  } = useGetAuthUserQuery();

  const {
    data: memberData,
    isLoading: isMemberLoading,
    error: memberError,
  } = useGetMemberQuery(
    {
      memberId,
    },
    {
      skip: isAuthLoading || !!authError,
    }
  );

  const [addLeave] = useAddLeaveMutation();

  useEffect(() => {
    if (isAuthLoading || !authData) return;
    if (authData?.role.toLowerCase() !== "admin") {
      router.replace("/");
      return;
    }
  }, [authData, isAuthLoading]);
  if (memberError) {
    toast.error("Something went wrong!");
    return;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await addLeave({
        memberId,
        leave,
      }).unwrap();
      if (response.success) {
        router.back();
      } else {
        console.log(response);
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <section className="w-full flex flex-col gap-5 max-w-screen-xl mx-auto mb-4">
      <div className="w-full mt-10">
        <BackButton title="Back" href="/organizations" />
      </div>
      <div className="mx-auto max-w-xl w-full border border-secondaryGray p-5 rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <div className="flex flex-col gap-2 mb-5">
            <label
              htmlFor="reason"
              className="font-semibold text-lg text-secondaryGray"
            >
              Leave Reason
            </label>
            <textarea
              name="reason"
              value={leave}
              onChange={(e) => setLeave(e.target.value)}
              className="border border-secondaryGray px-3 py-2 h-28 resize-none rounded-md text-lg text-secondaryGray outline-none"
            />
          </div>
          <Button type="submit" variant="custom">
            Add Leave
          </Button>
        </form>
      </div>
    </section>
  );
};
