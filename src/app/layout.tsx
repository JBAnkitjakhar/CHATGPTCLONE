// //src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { UserProvider } from "@/contexts/UserContext";
import { Providers } from "../components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free Fire",
  description: "Radcom application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>
        <UserProvider>
          <LoadingProvider>{children}</LoadingProvider>
        </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
