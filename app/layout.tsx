import "./globals.css";
import { Montserrat } from "next/font/google";
import Providers from "@/app/providers";
import { ThemeProvider } from "@/components/theme-provider";
import MainProvider from "./maincontext";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

const mont = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body suppressHydrationWarning={true} className={mont.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Providers>
            <MainProvider>
              <Header />
              <div className="px-16 my-8">{children}</div>
              <Toaster />
            </MainProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
