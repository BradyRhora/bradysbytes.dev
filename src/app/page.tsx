'use client'
import { useLayoutEffect } from "react";

import TerminalComponent from "./components/terminal";
import LinkCard from "./components/linkCard";

import styles from "@/app/styles/main.module.css";
import "@/app/styles/asteroid.module.css"

import "@/scripts/filesystem";
//import "@/scripts/asteroids";
import "@/scripts/terminalCommands";
import { setup } from "@/scripts/terminal";
import { hookAsteroidEvents } from "@/scripts/asteroids";
import GlowWrapper from "./components/glowwrapper";
import { startTerminal } from "@/scripts/pageFunctions";
import HeroHeader from "./components/hero";

export default function Home() {
	useLayoutEffect(() => {
		startTerminal();
		async function runSetup() {
        	await setup();
		}
		runSetup();
		hookAsteroidEvents();
	}, []);

	return (
		<>
		<GlowWrapper>
			<h1 className={styles.header}>BRADY&apos;S BYTES</h1> {/* Not too sure about how to style this */}
			<HeroHeader/>
			<LinkCard title="GAMES" description="Check out and play some of the games I've helped create!"/>
			<LinkCard title="BLOG" description="A space to read about my projects and thoughts."/>
		</GlowWrapper>
		<TerminalComponent></TerminalComponent>
		</>
	);
}