"use client";
import React, { useEffect, useState } from "react";
import { BackButton } from "@/components/BackButton";
import MemberAddingForm from "@/components/MemberAddingForm";
import { MembersSchema, MembersType } from "@/lib/types";
import {
  useAddMembersInOrganizationMutation,
  useGetAuthUserQuery,
  useGetOrganizationNameQuery,
} from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Loader2, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AddMemberPage = ({ organizationId }: { organizationId: string }) => {
  const { data: authData, isLoading: isAuthLoading } = useGetAuthUserQuery();
  const {
    data: organizationData,
    isError,
    isLoading: isOrganizationLoading,
  } = useGetOrganizationNameQuery(
    {
      organizationId,
      adminCognitoId: authData?.cognitoId,
    },
    {
      skip: !authData?.cognitoId || !organizationId,
    }
  );
  const [addMembers] = useAddMembersInOrganizationMutation();

  const form = useForm<MembersType>({
    resolver: zodResolver(MembersSchema),
  });

  // States
  const [membersLength, setMembersLength] = useState(1);
  const [members, setMembers] = useState<MembersType["members"] | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (membersLength === 0 || membersLength < 1) {
      setMembers(null);
      return;
    }

    let updatedData =
      membersLength === 0 || (members && members.length < 1) || !members
        ? null
        : [...members];
    if (!updatedData || updatedData.length === 0) {
      updatedData = [
        {
          id: Date.now(),
          imageUrl: "/defaultPersonImage.png",
          email: "",
          salary: "",
          monthlyTarget: "",
          name: "",
          phoneNumber: "",
          targetCurrency: "$",
          salaryCurrency: "$",
        },
      ];
      form.setValue("members", updatedData);
      setMembers(updatedData);
      return;
    }
    if (updatedData.length === 0) {
      updatedData = [
        {
          id: Date.now(),
          imageUrl: "/defaultPersonImage.png",
          email: "",
          salary: "",
          monthlyTarget: "",
          name: "",
          phoneNumber: "",
          targetCurrency: "$",
          salaryCurrency: "$",
        },
      ];
      form.setValue("members", updatedData);
      setMembers(updatedData);
      return;
    }
    for (let i = updatedData.length; i < membersLength; i++) {
      updatedData.push({
        id: Date.now() + i,
        imageUrl: "/defaultPersonImage.png",
        email: "",
        salary: "",
        monthlyTarget: "",
        name: "",
        phoneNumber: "",
        targetCurrency: "$",
        salaryCurrency: "$",
      });
    }
    form.setValue("members", updatedData);
    setMembers(updatedData);
  }, [membersLength]);

  if (isAuthLoading || isOrganizationLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="size-5 text-primaryGray animate-spin" />
          <span className="text-base text-primaryGray">Loading...</span>
        </div>
      </div>
    );
  }

  const handleIncreaseMember = () => {
    const memberLengthByMembers = !members ? 1 : members.length + 1;
    console.log(memberLengthByMembers);
    setMembersLength(membersLength + 1);
  };

  const removeMember = (id: number) => {
    let updatedMembers: any = null;
    setMembers((prevMembers) => {
      if (!prevMembers) return prevMembers;
      updatedMembers = prevMembers.filter((member) => member.id !== id);
      return updatedMembers;
    });
    if (membersLength === 1 || membersLength < 1) {
      setMembersLength(0);
    } else {
      setMembersLength(membersLength - 1);
    }
    form.setValue("members", updatedMembers);
  };

  const onSubmit = async (values: MembersType) => {
    if (!authData || !authData.cognitoId || !organizationData) return;
    const { data, error } = await addMembers({
      organizationId,
      adminCognitoId: authData.cognitoId,
      members: values.members,
    });
    if (error) {
      // TODO: Add toast error notification
      return;
    }
    if (data) {
      router.replace(`/organizations?organizationId=${organizationData.id}`);
    }
  };

  const getMembersLength = () => {
    if (
      organizationData &&
      organizationData.members &&
      organizationData.members.length &&
      organizationData.members.length
    ) {
      return organizationData?.members.length;
    }
    return 0;
  };

  return (
    <section className="w-full flex flex-col gap-5 max-w-screen-xl mx-auto mb-4">
      <div className="w-full mt-10">
        <BackButton title="Back" href="/organizations" />
      </div>
      {isError && !organizationData && (
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
      {organizationData && !isError && (
        <div className="flex items-center justify-center w-full max-w-xl mx-auto mt-5">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-secondaryGray">
                {organizationData.organizationName}
              </h1>
              <span className="text-base font-medium text-secondaryGray">
                {getMembersLength()}{" "}
                {getMembersLength() > 1 ? "Members" : "Member"}
              </span>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col w-full gap-2">
                  {members &&
                    members.length > 0 &&
                    members.map((member, index) => (
                      <MemberAddingForm
                        key={member.id}
                        form={form}
                        index={index}
                        member={member}
                        setMembers={setMembers}
                        removeMember={removeMember}
                      />
                    ))}
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-brand-500 hover:bg-brand-500/90 w-[120px] py-6"
                  >
                    Create
                  </Button>
                  <Button
                    type="button"
                    onClick={handleIncreaseMember}
                    size="lg"
                    className="bg-primaryGray hover:bg-primaryGray/90 w-[160px] py-6"
                  >
                    Add one more
                    <PlusIcon />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AddMemberPage;
