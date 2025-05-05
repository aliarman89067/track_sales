import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddMemberSalesSchema, AddMemberSalesType } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import TextInput from "@/components/inputs/TextInput";
import ImageInput from "@/components/inputs/ImageInput";
import { Button } from "@/components/ui/button";
import { useAddAgentSaleMutation } from "@/state/api";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  memberId: string;
  organizationId: string;
}

const AddAgentDataForm = ({ memberId, organizationId }: Props) => {
  const [addSale, result] = useAddAgentSaleMutation();

  const form = useForm<AddMemberSalesType>({
    resolver: zodResolver(AddMemberSalesSchema),
    defaultValues: {
      clientEmail: "",
      clientImageUrl: "/defaultPersonImage.png",
      clientName: "",
      clientPhoneNumber: "",
      description: "",
      totalPayment: "",
      paidAmount: "",
      remainingAmount: "",
    },
  });
  const onSubmit = async (values: AddMemberSalesType) => {
    try {
      const response = await addSale({
        ...values,
        memberId,
        organizationId,
      }).unwrap();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-3 border border-secondaryGray rounded-lg p-5"
      >
        <ImageInput
          form={form}
          isTitle={false}
          size="sm"
          fieldName="clientImageUrl"
          isOptional
        />
        <TextInput
          form={form}
          fieldName="clientName"
          size="sm"
          isTitle={false}
          placeHolder="Enter Client Name"
        />
        <TextInput
          form={form}
          fieldName="clientEmail"
          size="sm"
          isTitle={false}
          placeHolder="Client Email"
        />
        <TextInput
          form={form}
          fieldName="clientPhoneNumber"
          size="sm"
          isTitle={false}
          isOptional
          placeHolder="Client Phone Number"
        />
        <TextInput
          form={form}
          fieldName="totalPayment"
          size="sm"
          isTitle={false}
          placeHolder="Total Payment"
        />
        <TextInput
          form={form}
          fieldName="paidAmount"
          size="sm"
          isTitle={false}
          placeHolder="Paid Amount"
        />
        <TextInput
          form={form}
          isOptional
          fieldName="remainingAmount"
          size="sm"
          isTitle={false}
          placeHolder="Remaining Amount"
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-secondaryGray flex items-center gap-2 text-sm">
                (optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Description..."
                  className="w-full px-4 rounded-lg border-secondaryGray focus-within:border-secondaryGray/80 text-secondaryGray placeholder:text-gray-400 resize-none h-32"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </Form>
  );
};

export default AddAgentDataForm;
