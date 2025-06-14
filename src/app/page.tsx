'use client'
import { useLayoutEffect } from "react";

import styles from "@/app/styles/main.module.css";
import "@/app/styles/asteroid.module.css"
import TerminalComponent from "./components/terminal";
import Card from "./components/card";

import "@/scripts/filesystem";
//import "@/scripts/asteroids.js";
import "@/scripts/terminalCommands.js";
import { initGlow, cleanGlow } from "@/scripts/pageFunctions.js";
import { setup } from "@/scripts/terminal";
import { hookAsteroidEvents } from "@/scripts/asteroids";

export default function Home() {
	
	// This will be important when the content is dynamic so that we can automatically add glow counterparts
	useLayoutEffect(() => {
		initGlow();
		// cleanup
		return () => {
			cleanGlow();
		};
	}, []);

	useLayoutEffect(() => {
		async function runSetup() {
        	await setup();
		}
		runSetup();
		hookAsteroidEvents();
	}, []);

	return (
		<>
		<TerminalComponent></TerminalComponent>
		<div style={{ display: "none" }} id="container" className={`${styles.container} ${styles["vertical-center"]}`}>
			<h1 className={styles.header}>BRADY&apos;S BYTES</h1>
			<Card></Card>
		</div>
		</>
	);
}