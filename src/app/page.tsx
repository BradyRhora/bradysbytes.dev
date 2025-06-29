import { LinkCard } from "./components/items/cards";
import HeroHeader from "./components/items/hero";
import StyleDropDown from "./components/items/styleDropDown";

import styles from "@/app/styles/main.module.css";
import PageHeader from "./components/items/pageHeader";


export default function Home() {
	return (
		<>
			<PageHeader title="BRADY&apos;S BYTES" root={true}/>
			<HeroHeader/>

			<div className={styles.navLinks}>
				<LinkCard destination="/" title="BLOG [WIP]" description="A space to read about my projects and thoughts."/>
				<LinkCard destination="/games" title="GAMES" description="Check out and play some of the games I've helped create!"/>
				<LinkCard destination="/contact" title="GET IN TOUCH" description=""/>
			</div>

			<div className={styles.footerContainer}>
				<StyleDropDown/>
			</div>
		</>
	);
}