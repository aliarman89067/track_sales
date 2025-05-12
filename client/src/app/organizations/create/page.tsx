"use client";
import React, { useEffect, useState } from "react";
import { BackButton } from "@/components/BackButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import ImageInput from "@/components/inputs/ImageInput";
import TextInput from "@/components/inputs/TextInput";
import { Switch } from "@/components/ui/switch";
import { Loader2, PlusIcon } from "lucide-react";
import MemberAddingForm from "@/components/MemberAddingForm";
import {
  CreateOrganizationFormSchema,
  CreateOrganizationFormType,
} from "@/lib/types";
import {
  useCreateOrganizationMutation,
  useGetAuthUserQuery,
} from "@/state/api";
import { useRouter } from "next/navigation";

const OrganizationCreate = () => {
  const [createOrganization, result] = useCreateOrganizationMutation();

  const {
    data: authData,
    isLoading: isAuthLoading,
    isError,
  } = useGetAuthUserQuery();
  // Form State
  const [membersLength, setMembersLength] = useState(1);
  const [members, setMembers] = useState<MembersProps[] | null>(null);

  const router = useRouter();

  const form = useForm<CreateOrganizationFormType>({
    resolver: zodResolver(CreateOrganizationFormSchema),
    defaultValues: {
      imageUrl: "/defaultOrganization.png",
      organizationName: "",
      organizationKeyword: "",
      isMember: false,
    },
  });

  const handleIncreaseMember = () => {
    const memberLengthByMembers = !members ? 1 : members.length + 1;
    console.log(memberLengthByMembers);
    setMembersLength(membersLength + 1);
  };

  useEffect(() => {
    if (isError) {
      alert("Something went wrong!");
      return;
    }
    if (!authData || authData.role !== "admin") {
      router.replace("/");
    }
  }, [isAuthLoading, isError, authData]);

  useEffect(() => {
    setMembers((prevMembers) => {
      if (membersLength === 0 || membersLength < 1) {
        return null;
      }
      if (!prevMembers || prevMembers.length === 0) {
        const firstMember = [
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
        form.setValue("members", firstMember);
        return firstMember;
      }

      if (prevMembers.length === membersLength) return prevMembers;

      const updatedMembers = [...prevMembers];

      for (let i = prevMembers.length; i < membersLength; i++) {
        updatedMembers.push({
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
      form.setValue("members", updatedMembers);
      return updatedMembers;
    });
  }, [membersLength]);

  if (isAuthLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="size-5 text-primaryGray animate-spin" />
          <span className="text-base text-primaryGray">Loading...</span>
        </div>
      </div>
    );
  }

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

  const onSubmit = async (values: CreateOrganizationFormType) => {
    const { data, error } = await createOrganization({
      ...values,
      adminCognitoId: authData?.cognitoId,
    });
    if (error) {
      // TODO: add error toast notification
      return;
    }
    if (data) {
      router.push(`/organizations/admin?organizationId=${data.id}`);
    }
  };

  return (
    <section className="w-full flex flex-col gap-5 max-w-screen-xl mx-auto mb-4">
      <div className="w-full mt-10">
        <BackButton title="Back" href="/organizations" />
      </div>
      <div className="mx-auto flex flex-col max-w-xl w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col space-y-3"
          >
            <ImageInput
              form={form}
              title="Organization Image"
              isTitle
              size="lg"
              fieldName="imageUrl"
              isOptional
            />
            <TextInput
              form={form}
              title="Organization Name"
              isTitle
              fieldName="organizationName"
              placeHolder="Template sales team..."
            />
            <div className="w-[50%]">
              <TextInput
                form={form}
                title="Organization Keyword"
                isTitle
                fieldName="organizationKeyword"
                placeHolder="Template"
              />
            </div>
            <div className="mt-2" />
            <FormField
              control={form.control}
              name="isMember"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white border border-gray-500"
                      />
                    </FormControl>
                    <FormLabel className="font-medium text-base text-secondaryGray">
                      Add Members{" "}
                      <span className="text-[14px]">(optional)</span>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues("isMember") && (
              <>
                {members &&
                  members.map((member, index) => (
                    <MemberAddingForm
                      key={index + member.id}
                      index={index}
                      member={member}
                      setMembers={setMembers}
                      form={form}
                      removeMember={removeMember}
                      isArray
                    />
                  ))}
              </>
            )}
            <div className="flex items-center gap-2 mt-6">
              <Button
                type="submit"
                size="lg"
                className="bg-brand-500 hover:bg-brand-500/90 w-[120px] py-6"
              >
                Create
              </Button>
              {form.getValues("isMember") && (
                <Button
                  type="button"
                  onClick={handleIncreaseMember}
                  size="lg"
                  className="bg-primaryGray hover:bg-primaryGray/90 w-[160px] py-6"
                >
                  Add one more
                  <PlusIcon />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default OrganizationCreate;
