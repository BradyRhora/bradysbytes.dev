import type { Metadata } from "next";
import { cookies } from "next/headers";

import "./globals.css";
import styles from "@/app/styles/main.module.css";
import { BBFileSystem } from "@/scripts/filesystem";

import MainBody from "@/app/components/wrappers/mainBody";

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
      <MainBody>
		    {children}
      </MainBody>
	  </body>
	</html>
  );
}
