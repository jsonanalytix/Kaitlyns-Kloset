import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kaitlyn's Kloset",
  description: "Your personal AI-powered wardrobe assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full font-sans antialiased">
        <div className="flex h-full bg-background">
          <Sidebar />
          <div className="flex flex-1 flex-col min-h-0">
            <Header />
            <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
              {children}
            </main>
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}
