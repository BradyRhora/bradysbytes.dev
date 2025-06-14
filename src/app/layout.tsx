import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";
import styles from "@/app/styles/main.module.css";

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
      <body className={`${styles.main} ${inconsolata.className}`}>
        {children}
      </body>
    </html>
  );
}
