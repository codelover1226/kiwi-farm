"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const newMemberSchema = z.object({
  fullName: z.string().min(3, {
    message: "Please enter first and last name.",
  }),
  cellPhone: z.string().min(10, {
    message: "Cell Phone must be at least 10 characters.",
  }),
  instagramUrl: z.string().optional(),
  // facebookUrl: z.string().optional(),
});

export type TNewMemberSchema = z.infer<typeof newMemberSchema>;

export function NewMemberForm() {
  const router = useRouter();
  // ...
  // 1. Define your form.
  const form = useForm<z.infer<typeof newMemberSchema>>({
    resolver: zodResolver(newMemberSchema),
    defaultValues: {
      fullName: "",
      instagramUrl: "",
      // facebookUrl: "",
      cellPhone: "",
    },
  });

  const formatPhoneNumber = (phoneNumber) => {
    const numericOnly = phoneNumber.replace(/\D/g, "");

    if (numericOnly.length <= 3) {
      return numericOnly;
    } else if (numericOnly.length <= 6) {
      return `(${numericOnly.slice(0, 3)}) ${numericOnly.slice(3)}`;
    } else {
      return `(${numericOnly.slice(0, 3)}) ${numericOnly.slice(
        3,
        6
      )}-${numericOnly.slice(6)}`;
    }
  };

  const handleChangeForm = (event: any) => {
    const rawInput = event.target.value;
    const formattedInput = formatPhoneNumber(rawInput);
    form.setValue("cellPhone", formattedInput);
  };

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof newMemberSchema>) {

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.json().then(() => router.push("/thank-you"));
    } catch (error) {
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex py-5 mb-20 w-full justify-center lg:px-20 xl:px-40"
      >
        <div className="flex flex-col md:flex-col text-left max-w-md items-center gap-10 px-6">
          <div className="w-full">
            <h2 className="text-3xl text-center">New Member Registration</h2>
            <br />
            <h3 className="text-center">
              <strong>Instructions:</strong> Please fill out form below. Upon
              submission, please allow approximately 1-2 hours for a friend
              request from Kiwi Canna at social media provided.
            </h3>
          </div>
          <div className="w-full bg-accent rounded-sm p-6 ">
            <div className="">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={40}
                        className="bg-white"
                        placeholder="Full Name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-span-4 mt-5">
              <FormField
                control={form.control}
                name="cellPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="Phone Number"
                        maxLength={14}
                        {...field}
                        onChange={handleChangeForm}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-span-4 mt-5">
              <FormField
                control={form.control}
                name="instagramUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram/Facebook @ </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        maxLength={50}
                        placeholder="Instagram or Facebook URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-5">
              {" "}
              <Button
                className="bg-[#017c6b] hover:bg-[#009688] w-32 h-12 mt-2"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
