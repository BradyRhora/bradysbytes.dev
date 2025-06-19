"use client"
import { useState, useEffect } from "react";

import { LinkCard } from "./components/cards";
import HeroHeader from "./components/hero";
import DropdownBox from "./components/dropdownBox";

import styles from "@/app/styles/main.module.css";
import "@/app/styles/asteroid.module.css"

import { Terminal } from "@/scripts/terminal";
import { BBDirectory, BBFile } from "@/scripts/filesystem";
import StyleSelector from "./components/styleSelector";
/*import "@/scripts/filesystem";
import "@/scripts/terminalCommands";*/

export default function Home() {
	const [styleFiles, setStyleFiles] = useState<BBFile[]>([]);

	useEffect(() => {
		function loadStyles() {
			const styleDir = Terminal.instance.fileSystem.getFileFromPathString("/styles") as BBDirectory;
			const styleFiles = styleDir.getAllFiles();
			const filteredFiles = styleFiles.filter((file: BBFile) => file.name.endsWith(".sty"));
			setStyleFiles(filteredFiles);
		}

		loadStyles();
	}, []);

	return (
		<>
			<h1 className={styles.header}>BRADY&apos;S BYTES</h1> {/* Not too sure about how to style this */}
			<HeroHeader/>
			<LinkCard destination="/" title="BLOG [WIP]" description="A space to read about my projects and thoughts."/>
			<LinkCard destination="/games" title="GAMES" description="Check out and play some of the games I've helped create!"/>
			<LinkCard destination="/contact" title="GET IN TOUCH" description=""/>
			<div className={styles.footerContainer}>
				<DropdownBox>
				{
					styleFiles && styleFiles.map((styleFile) => {
						return <StyleSelector key={styleFile.name} styleFile={styleFile}/>
					})
				}
				</DropdownBox>
			</div>
		</>
	);
}