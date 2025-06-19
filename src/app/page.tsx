import { LinkCard } from "./components/cards";
import HeroHeader from "./components/hero";

import styles from "@/app/styles/main.module.css";
import "@/app/styles/asteroid.module.css"

import "@/scripts/filesystem";
//import "@/scripts/asteroids";
import "@/scripts/terminalCommands";

export default function Home() {

	return (
		<>
			<h1 className={styles.header}>BRADY&apos;S BYTES</h1> {/* Not too sure about how to style this */}
			<HeroHeader/>
			<LinkCard destination="/" title="BLOG [WIP]" description="A space to read about my projects and thoughts."/>
			<LinkCard destination="/games" title="GAMES" description="Check out and play some of the games I've helped create!"/>
			<LinkCard destination="/contact" title="GET IN TOUCH" description=""/>
		</>
	);
}