"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, redirect } from "next/navigation";
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
import { toast } from "react-hot-toast";
import { selectUser } from "@/store/features/auth/authSlice";
import { useAppSelector } from "@/store/hooks";

export const changeUserPassSchema = z.object({
  password: z.string().min(4, {
    message: "Must be 4 or more characters long.",
  }),
  password1: z.string().min(4, {
    message: "Must be 4 or more characters long.",
  }),
});

export type TChangeUserPaaSchema = z.infer<typeof changeUserPassSchema>;

export function ChangeUserPassForm() {
  const user = useAppSelector(selectUser);

  const form = useForm<z.infer<typeof changeUserPassSchema>>({
    resolver: zodResolver(changeUserPassSchema),
    defaultValues: {
      password: "",
      password1: "",
    },
  });

  async function onSubmit(values: z.infer<typeof changeUserPassSchema>) {
    try {
      const response = await fetch("/api/auth/changePass", {
        method: "POST",
        body: JSON.stringify({
          id: user.id,
          password: values.password,
          password1: values.password1,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success("You changed your password!.");
      } else {
        const unit8 = (await response.body.getReader().read()).value;
        const errormsg = Buffer.from(unit8).toString();
        toast.error(errormsg);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex py-5 mb-0 w-full justify-center lg:px-20 xl:px-40"
      >
        <div className="flex flex-grow md:flex-row flex-wrap text-left  items-center gap-2 px-6">
          <div className="w-full">
            <h2 className="text-xl text-center">Change Password</h2>
          </div>
          <div className="w-full flex flex-row flex-wrap bg-accent rounded-sm p-6 justify-evenly sm:gap-4">
            <div className="w-2/12 min-w-[128px] mt-0">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Password</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="Password"
                        maxLength={40}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-2/12 min-w-[128px] mt-0">
              <FormField
                control={form.control}
                name="password1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visitor Password</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="Password"
                        maxLength={40}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-3 w-[128px]">
              <Button
                className="bg-[#017c6b] hover:bg-[#009688] w-32 h-12 mt-2"
                type="submit"
              >
                Change
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
