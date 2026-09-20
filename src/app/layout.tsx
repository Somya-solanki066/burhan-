import { Noto_Sans } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const noto = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Burhan Cash Admin",
  description: "Daily cash in / cash out admin panel",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${noto.variable} h-full antialiased`}>
      <body className={`${noto.className} min-h-full bg-[#f4efe6] text-stone-900`}>
        {children}
      </body>
    </html>
  );
}
