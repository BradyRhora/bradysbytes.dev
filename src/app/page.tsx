'use client'

import styles from "./terminal.module.css";
import { useEffect } from "react";
import TerminalComponent from "./terminal";

import "@/scripts/filesystem";
//import "@/scripts/asteroids.js";
import "@/scripts/terminal-commands.js";
import { initGlow } from "@/scripts/pageFunctions.js";
import { setup } from "@/scripts/terminal";
import { hookAsteroidEvents } from "@/scripts/asteroids";

export default function Home() {
	useEffect(() => {
		initGlow();
        setup();
		hookAsteroidEvents();
		// cleanup
		return () => {
		};
	}, []);
	return (
		<>
		<TerminalComponent></TerminalComponent>
		<div style={{ display: "none" }} id="container" className={`${styles.container} ${styles["vertical-center"]}`}>
			<h1 className={styles.header}>BRADY&apos;S BYTES</h1>
		</div>
		</>
	);
}