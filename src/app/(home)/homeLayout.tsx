'use client'
import Footer from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import Popup from "@/components/Popup";
import Popup1 from "@/components/Popup1";
import { useState } from "react";
import { StickyButton } from "@/components/StickyButton";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [open, setOpen] = useState(false);

    return (    
      <div>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Popup openPopup1={setOpen}/>
          {open && <Popup1 />}
          <NavBar backend={false}/>

          {children}
          <StickyButton />

          <Footer />
        </ThemeProvider>
      </div>
    );
}
