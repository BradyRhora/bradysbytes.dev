"use client"
import { useLayoutEffect } from "react";

import { setup } from "@/scripts/terminal";
import { hookAsteroidEvents } from "@/scripts/asteroids";
import { startTerminal } from "@/scripts/pageFunctions";

import GlowWrapper from "./glowWrapper";
import TerminalComponent from "@/app/components/items/terminal";
import ContextProvider from "@/app/components/wrappers/contextProviderWrapper";

import styles from "@/app/styles/main.module.css";

export default function MainBody({children,}: Readonly<{children: React.ReactNode;}>) {
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
        <ContextProvider>
            <GlowWrapper>
                {children}
                <div className={styles.terminalSpacer}></div>
            </GlowWrapper>
        </ContextProvider>
		<TerminalComponent/>
        </>
    );
}