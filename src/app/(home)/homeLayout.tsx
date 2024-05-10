'use client'
import Footer from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import Popup from "@/components/Popup";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Home Layout");

    return (    
      <div>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Popup />
          <NavBar backend={false}/>

          {children}

          <Footer />
        </ThemeProvider>
      </div>
    );
}
