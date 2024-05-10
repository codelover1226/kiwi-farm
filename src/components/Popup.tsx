"use client";
import { createCookie, checkCookie } from "../app/actions";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "./ui/separator";

export default function Popup() {
  const [isClient, setIsClient] = useState(false);
  const [show, setShow] = useState(false); //show warning message

  const pathname = usePathname();

  const alertCancel = () => {
    setShow(true);
  };

  const alertProceed = () => {
    createCookie({
      name: "kiwi",
      value: "verified",
      httpOnly: true,
      path: "/",
      maxAge: 3000,
    });
    setIsOpen(false);
  };

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const verify = async () => {
      const result = await checkCookie();
      setIsOpen(result);
    };

    verify();
  }, []);

  return isClient && pathname.slice(0, 6) !== "/admin" ? (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="xs:max-w-xs md:max-w-md py-8 px-8 ">
        <AlertDialogHeader className="items-center mt-2">
          <Image
            src="/kiwi_farms_text.jpg"
            alt="Kiwi Farms - Premium Cannabis"
            width={180}
            height={100}
            className="pb-3"
          />
          <AlertDialogTitle>Are you over 21 years old?</AlertDialogTitle>
          <AlertDialogDescription>
            Please confirm if you are 21 years of age or older.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogDescription className="flex flex-col gap-3 py-4">
          <AlertDialogCancel
            className="h-12 border-1 outline-2 outline-black hover:border-[#00897b] border-[black]"
            onClick={alertCancel}
          >
            Not Yet
          </AlertDialogCancel>
          <AlertDialogAction
            className="h-12 bg-[#017c6b] hover:bg-[#009688]"
            onClick={alertProceed}
          >
            Yes, Proceed
          </AlertDialogAction>
        </AlertDialogDescription>
        {show ? (
          <AlertDialogDescription className="text-red-500">
            Sorry! This website is for viewers 21 years of age and older.
          </AlertDialogDescription>
        ) : (
          <></>
        )}

        <AlertDialogDescription className="pt-2">
          <Separator />
          <br />
          By accessing this site, you accept the <u>Terms of Use</u> and{" "}
          <u>Privacy Policy</u>.
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <></>
  );
}
