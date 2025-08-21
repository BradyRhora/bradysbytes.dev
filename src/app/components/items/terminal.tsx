'use client'

import styles from "@/app/styles/terminal.module.css";
import { Terminal } from "@/scripts/terminal";
export default function TerminalComponent() {
	return (
		<>
		<div id="terminal-container" className={styles["terminal-container"]}>
			<div id="terminal-blur" className={`${styles["terminal-blur"]} glow`}></div>
			<div id="terminal" className={styles.terminal}></div>
		</div>
		<div id="intro-skip-button" className={styles.skipIntroButtonContainer}>
			<button className={`${styles.skipIntroButton} glow`}>SKIP</button>
			<button onClick={() => {Terminal.instance.skipIntro = true}} className={styles.skipIntroButton}>SKIP</button>
		</div>
		</>
	);
}
