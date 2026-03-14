import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Numa Nutrition",
  description: "100% natural and halal health products",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
