"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { getAgents } from "@/store/features/agents/agentsSlice";

import { useAppDispatch } from "@/store/hooks";

export const newUserSchema = z.object({
  name: z.string().min(1, {
    message: "name is required.",
  }),
  password: z.string().min(4, {
    message: "Must be 4 or more characters long.",
  }),
  password1: z.string().min(4, {
    message: "Must be 4 or more characters long.",
  }),
  isAdmin: z.boolean({
    required_error: "isAdmin is required",
    invalid_type_error: "isAdmin must be a boolean",
  }),
});

export type TNewUserSchema = z.infer<typeof newUserSchema>;

export function NewUserForm({ user }: { user: string }) {
  const isSuperUser = user == "super";
  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      password: "",
      password1: "",
      isAdmin: false,
    },
  });

  async function onSubmit(values: z.infer<typeof newUserSchema>) {
    try {
      if (values.password1 == values.password) {
        toast.error("Passwords can't be same.");
        return;
      }
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success("You added the new user!.");
        dispatch(getAgents(isSuperUser));
      } else {
        const unit8 = (await response.body.getReader().read()).value;
        const errormsg = Buffer.from(unit8).toString();
        toast.error(errormsg);
        console.error(errormsg);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  }
  const handleChangeIsAdmin = (event: any) => {
    const rawInput = event.target.checked;
    form.setValue("isAdmin", rawInput);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex py-5 mb-0 w-full justify-center lg:px-20 xl:px-40"
      >
        <div className="flex flex-grow md:flex-row flex-wrap text-left  items-center gap-2 px-6">
          <div className="w-full">
            <h2 className="text-xl text-center">Add User</h2>
          </div>
          <div className="w-full flex flex-row flex-wrap bg-accent rounded-sm p-6 justify-evenly sm:gap-4">
            <div className=" mt-0 w-2/12 min-w-[128px]">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Name</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={40}
                        className="bg-white"
                        placeholder="Name"
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
            <div
              className={
                isSuperUser
                  ? `w-2/12 min-w-[128px] mt-0 hidden`
                  : `w-2/12 min-w-[128px] mt-0 hidden`
              }
            >
              <FormField
                control={form.control}
                name="isAdmin"
                render={({ field }) => (
                  <FormItem className="w-[30px]">
                    <FormLabel className="text-center self-center">
                      isAdmin
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder=""
                        type="checkbox"
                        checked={field.value}
                        onChange={handleChangeIsAdmin}
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
                Add
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
