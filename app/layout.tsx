import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "BhumiBot - A bot by Bhumiputra for TIFAN",
  description:
    "An intelligent chatbot was developed for the Bhumiputra team from DIEMS, Chhatrapati Sambhajinagar to compete in the TIFAN competition! Ask any question related to our product",
};

const latoFont = Lato({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${latoFont.className}`}>{children}</body>
    </html>
  );
}
