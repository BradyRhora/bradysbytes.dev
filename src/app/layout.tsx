import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";
import terminalStyles from "./terminal.module.css";

export const metadata: Metadata = {
  title: "BradysBytes",
  description: "[Think of some catchy description here]",
};

const inconsolata = Inconsolata({
  subsets: ['latin'],
  weight: "600"
});

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={`${terminalStyles.main} ${inconsolata.className}`}>
        {children}
      </body>
    </html>
  );
}
