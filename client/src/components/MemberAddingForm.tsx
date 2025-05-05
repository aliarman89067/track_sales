import React, { useEffect } from "react";
import ImageInput from "./inputs/ImageInput";
import { Button } from "./ui/button";
import TextInput from "./inputs/TextInput";

const MemberAddingForm = ({
  form,
  member,
  setMembers,
  index,
  removeMember,
}: MemberAddingFormProps) => {
  return (
    <div className="w-full h-fit px-5 py-4 border border-gray-400 rounded-lg">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between">
          <ImageInput
            isTitle={false}
            fieldName={`members.${index}.imageUrl`}
            form={form}
            size="sm"
            index={index}
            isMembersState
            setMembers={setMembers}
            isOptional
            memberId={member.id}
          />
          <Button
            type="button"
            onClick={() => removeMember(member.id)}
            variant="destructive"
            size="sm"
            className="bg-rose-400 hover:bg-rose-500 rounded-lg"
          >
            Remove -
          </Button>
        </div>
        <TextInput
          isTitle
          title="Member name"
          form={form}
          placeHolder="Enter member name"
          fieldName={`members.${index}.name`}
          isMembersState
          setMembers={setMembers}
          index={index}
          size="sm"
          memberId={member.id}
        />
        <TextInput
          isTitle
          title="Member email"
          form={form}
          placeHolder="Enter member email"
          fieldName={`members.${index}.email`}
          isMembersState
          setMembers={setMembers}
          index={index}
          size="sm"
          memberId={member.id}
        />
        <TextInput
          isTitle
          title="Member phone number"
          form={form}
          isOptional
          placeHolder="Enter member phone number"
          fieldName={`members.${index}.phoneNumber`}
          isMembersState
          setMembers={setMembers}
          index={index}
          size="sm"
          memberId={member.id}
        />
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <TextInput
              isTitle
              title="Member monthly target"
              form={form}
              placeHolder="Enter member monthly target"
              fieldName={`members.${index}.monthlyTarget`}
              isMembersState
              setMembers={setMembers}
              index={index}
              size="sm"
              memberId={member.id}
            />
          </div>
          <div className="max-w-[80px]">
            <TextInput
              isTitle
              title="Currency"
              form={form}
              placeHolder="$"
              fieldName={`members.${index}.targetCurrency`}
              isMembersState
              setMembers={setMembers}
              index={index}
              size="sm"
              memberId={member.id}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <TextInput
              isTitle
              title="Member monthly salary"
              form={form}
              placeHolder="Enter member monthly salary"
              fieldName={`members.${index}.salary`}
              isMembersState
              setMembers={setMembers}
              index={index}
              size="sm"
              memberId={member.id}
            />
          </div>
          <div className="max-w-[80px]">
            <TextInput
              isTitle
              title="Currency"
              form={form}
              placeHolder="$"
              fieldName={`members.${index}.salaryCurrency`}
              isMembersState
              setMembers={setMembers}
              index={index}
              size="sm"
              memberId={member.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberAddingForm;
