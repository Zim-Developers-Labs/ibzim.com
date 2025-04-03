import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const logoFont = localFont({ src: "../fonts/Bevan-Regular.ttf" });
