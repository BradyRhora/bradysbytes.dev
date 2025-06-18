import type { Metadata } from "next";
import "./globals.css";
import styles from "@/app/styles/main.module.css";
import { BBFileSystem } from "@/scripts/filesystem";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "BradysBytes",
  description: "[Think of some catchy description here]",
};

export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  const fs = new BBFileSystem();
  const cookieStore = await cookies();
  const styleFileName = cookieStore.get('terminal-style-file')?.value;
  let styleVars = null;
  if (styleFileName != undefined) {
    const styleFile = fs.getFileFromPathString(styleFileName);
    if (styleFile && styleFile.content) styleVars = JSON.parse(styleFile.content);
  }

  return (
    <html style={styleVars} lang="en">
      <body className={`${styles.main}`}>
        {children}
      </body>
    </html>
  );
}
