import React, { ChangeEvent } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

const TextInput = ({
  fieldName,
  form,
  isTitle,
  placeHolder,
  title,
  isMembersState,
  setMembers,
  index,
  size = "lg",
  isOptional = false,
  memberId,
}: TextInputProps) => {
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue(fieldName, value);
    if (isMembersState && setMembers && memberId) {
      setMembers((prevMembers) => {
        if (!prevMembers) return prevMembers;
        return prevMembers.map((member) => {
          if (member.id === memberId) {
            const type = fieldName.split(".")[2];
            return { ...member, [type]: e.target.value };
          } else {
            return member;
          }
        });
      });
    }
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          {isTitle ? (
            <FormLabel
              className={cn(
                "font-medium text-secondaryGray flex items-center gap-2",
                isMembersState ? "text-base" : "text-lg"
              )}
            >
              {title}
              {isOptional && <span className="text-sm">(optional)</span>}
            </FormLabel>
          ) : (
            <FormLabel className="font-medium text-secondaryGray translate-y-1">
              {isOptional && <span className="text-sm">(optional)</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
              value={field.value}
              onChange={handleTextChange}
              placeholder={placeHolder}
              style={{ fontSize: isMembersState ? 14 : 16 }}
              className={cn(
                "w-full px-4 rounded-lg border-secondaryGray focus-within:border-secondaryGray/80 text-secondaryGray placeholder:text-gray-400",
                size === "lg" ? "py-7" : "py-6",
                isMembersState ? "border font-medium" : "border font-normal"
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextInput;
