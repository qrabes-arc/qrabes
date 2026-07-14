import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "QRABES",
    template: "%s | QRABES",
  },
  description:
    "Luxury Lifestyle Magazine, Discover Luxury Fashion, Travel, Cars, Watches, Hotels and More.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">

        <Header />

        <div className="min-h-screen max-w-[1600px] mx-auto flex">

          {/* Left Sidebar */}
          <aside className="hidden lg:block w-72 border-r border-zinc-800">
            <LeftSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-h-screen">
            {children}
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-80 border-l border-zinc-800">
            <RightSidebar />
          </aside>

        </div>

        <Footer />

      </body>
    </html>
  );
}
