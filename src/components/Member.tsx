import { Leaf, Users, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const thisClass =
  "min-w-[200px] mb-10 mt-16 px-12 py-12 mx-2 shadow-lg border-2 rounded-sm max-w-sm text-center flex flex-col justify-center items-center";

export default function MemberSection() {
  return (
    <div className="flex flex-col items-center justify-between py-10 mb-20">
      <Separator className="mt-10 mb-12 max-w-screen-xl xs:max-w-xs md:max-w-5xl" />
      <div className="flex flex-row flex-wrap xs:gap-2 md:gap-24 items-center justify-center">
        <div className={`${thisClass} bg-[white] border-[#017c6b]`}>
          <Users className="mb-2" color="#017c6b" size={36} />
          <h2 className="text-3xl text-black">Members Only</h2>
          <h3 className="text-xl text-[#017c6b]">Login</h3>
          <br />
          <h3 className="text-md text-black mt-2">Login for members area</h3>
          <Link href="/login">
            <Button
              className="bg-[#017c6b] hover:bg-[#009688] shadow-lg w-32 h-12 mt-4"
              type="submit"
            >
              Login
            </Button>
          </Link>
        </div>

        <div className={`${thisClass} bg-[white] border-[#D3D3D3]`}>
          <Leaf className="mb-2" color="#017c6b" size={36} />
          <h2 className="text-3xl text-black">New Member</h2>
          <h3 className="text-xl text-[#017c6b]">Registration</h3>
          <br />
          <h3 className="text-md text-black mt-2">
            Sign up for exclusive access
          </h3>
          <Link href="/membership">
            <Button
              className="bg-[#017c6b] hover:bg-[#009688] shadow-lg w-32 h-12 mt-4"
              type="submit"
            >
              Register Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
