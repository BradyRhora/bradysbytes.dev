"use client"
import { useState, useLayoutEffect, createContext } from "react";

import { getCookie } from "@/scripts/lib/helpers";
import { setup } from "@/scripts/terminal";
import { hookAsteroidEvents } from "@/scripts/asteroids";
import { startTerminal } from "@/scripts/pageFunctions";

import GlowWrapper from "./glowWrapper";
import TerminalComponent from "@/app/components/items/terminal";
import ContextProvider from "@/app/components/wrappers/contextProviderWrapper";

import { User } from "../../../../generated/prisma";

import styles from "@/app/styles/main.module.css";

export const UserContext = createContext<[User | null, React.Dispatch<React.SetStateAction<User | null>>]>([null, () => {}]);

export default function MainBody({children,}: Readonly<{children: React.ReactNode;}>) {
    const [user, setUser] = useState<User | null>(null);

    useLayoutEffect(() => {
        async function loadUserCookie() {
            const userID = getCookie("user");
            if (userID) {
                const res = await fetch("/api/GetUser?id="+userID)
                const userData = await res.json();
                
                setUser(userData);
                return userData;
            }
        }

        startTerminal();
        loadUserCookie().then(userData => {
            setup(userData?.name);
        });

        hookAsteroidEvents();
        //setup();
    }, []);

    return (
        <>
        <UserContext.Provider value={[user, setUser]}>
            <ContextProvider>
                <GlowWrapper> {/* <-- Sh*t gets FREAKY in here... */}
                    {children}
                    <div className={styles.terminalSpacer}></div>
                </GlowWrapper>
            </ContextProvider>
        </UserContext.Provider>
		<TerminalComponent/>
        </>
    );
}