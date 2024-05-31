"use client";
import Link from "next/link";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ExitIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import {
  logout,
  selectIslogin,
  selectIsVisitor,
  selectIsNothing
} from "@/store/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function NavMenu() {
  const router = useRouter();
  const isLogin = useAppSelector(selectIslogin); 
  const isNothing = useAppSelector(selectIsNothing);
  const isVisitor = useAppSelector(selectIsVisitor);
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    if(isLogin) {
      router.push('/dashboard');
    }
    router.push("/login");
    // console.log("handleLogin");
  }

  const handleLogout = () => {
    router.push("/");
    dispatch(logout());
  }

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/flower" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Flower
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/edibles" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Edibles
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/extracts" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Extracts
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/pre-rolls" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pre-Rolls
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Our Story
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/membership" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              New Members
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {isVisitor &&
          <NavigationMenuItem>
            <div className="flex h-16 items-center" onClick={handleLogout}>
              <div className="flex items-center justify-center text-xl py-2 px-4 rounded-sm bg-slate-50 hover:bg-slate-200 cursor-pointer">
                <span ><ExitIcon width={30} height={30}/></span>
              </div>
            </div>
          </NavigationMenuItem>
        }

        {(isNothing || !isVisitor) &&
          <NavigationMenuItem>
            <div  onClick={handleLogin} className="cursor-pointer">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Login
              </NavigationMenuLink>
            </div>
          </NavigationMenuItem>
        }
      </NavigationMenuList>
    </NavigationMenu>
  );
}
