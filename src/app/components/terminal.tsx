'use client'

import styles from "@/app/styles/terminal.module.css";
export default function TerminalComponent() {
	return (
		<div id="terminal-container" className={styles["terminal-container"]}>
			<div id="terminal" className={styles.terminal}></div>
			<div id="terminal-blur" className={`${styles["terminal-blur"]} glow`}></div>
		</div>
	);
}
