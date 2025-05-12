"use client";

import { BackButton } from "@/components/BackButton";
import MemberAddingForm from "@/components/MemberAddingForm";
import { MemberUpdateForm } from "@/components/MemberUpdateForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MemberSchema, MemberType } from "@/lib/types";
import {
  useGetAuthUserQuery,
  useGetMemberQuery,
  useUpdateMemberMutation,
} from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  memberId: string;
}

export const UpdateMemberContainer = ({ memberId }: Props) => {
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
      skip: !memberId || !authData || authData.role.toLowerCase() !== "admin",
    }
  );

  const [updateMember] = useUpdateMemberMutation();

  const router = useRouter();
  const [isFormReady, setIsFormReady] = useState(false);

  const form = useForm<MemberType>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      name: memberData?.name ?? "",
      email: memberData?.email ?? "",
      imageUrl: memberData?.imageUrl ?? "",
      monthlyTarget: memberData?.monthlyTarget.toString() ?? "",
      phoneNumber: memberData?.phoneNumber ?? "",
      salary: memberData?.salary.toString() ?? "",
      targetCurrency: memberData?.targetCurrency ?? "",
      salaryCurrency: memberData?.salaryCurrency ?? "",
    },
  });

  useEffect(() => {
    if (!memberId) {
      router.replace("/");
      return;
    }
    if (!isAuthLoading) {
      if (!authData || authData.role.toLowerCase() !== "admin") {
        router.replace("/");
        return;
      }
      if (authData && memberData) {
        form.reset({
          name: memberData.name ?? "",
          email: memberData.email ?? "",
          imageUrl: memberData.imageUrl ?? "",
          monthlyTarget: memberData.monthlyTarget?.toString() ?? "",
          phoneNumber: memberData.phoneNumber ?? "",
          salary: memberData.salary?.toString() ?? "",
          targetCurrency: memberData.targetCurrency ?? "",
          salaryCurrency: memberData.salaryCurrency ?? "",
        });
        form.setValue("id", memberData.id);
        setIsFormReady(true);
      }
    }
  }, [authData, isAuthLoading, memberData]);

  if (isAuthLoading || isMemberLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="size-5 text-primaryGray animate-spin" />
          <span className="text-base text-primaryGray">Loading...</span>
        </div>
      </div>
    );
  }

  const onSubmit = async (values: MemberType) => {
    try {
      await updateMember(values).unwrap();
      toast.success("Member updated Successfully.");
      setTimeout(() => {
        router.back();
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later!");
    }
  };

  return (
    <section className="w-full flex flex-col gap-5 max-w-screen-xl mx-auto mb-4">
      <div className="w-full mt-10">
        <BackButton title="Back" href="/organizations" />
      </div>
      {memberError && !memberData && (
        <div className="flex items-center justify-center w-full h-[60vh]">
          <div className="flex flex-col items-center gap-2  pointer-events-none select-none">
            <Image
              src="/notFound.png"
              alt="Not Found Image"
              width={1000}
              height={1000}
              className="w-[300px] object-contain pointer-events-none select-none"
            />
            <span className="flex items-center gap-2 text-2xl text-rose-500 font-bold">
              Something Went Wrong <CircleAlert />
            </span>
            <p>Please try again later</p>
          </div>
        </div>
      )}
      {memberData && !memberError && isFormReady && (
        <div className="flex items-center justify-center w-full max-w-xl mx-auto mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-col w-full gap-2">
                <MemberUpdateForm form={form} index={0} isArray={false} />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-brand-500 hover:bg-brand-500/90 w-[120px] py-6"
                >
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </section>
  );
};
