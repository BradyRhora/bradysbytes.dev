"use client";
import React, { createContext, useState, useEffect } from "react";

import { wait, shuffle } from "@/scripts/helpers";

export const SkillContext = createContext("");
export const PafSkipContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>]>([0, () => {}]);
export const PafPlayingContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([false, () => {}]);

export default function ContextProvider({children}: {children: React.ReactNode}) {
    const [skill, setSkill] = useState("");
    const [pafSkips, setPafSkips] = useState(0);
    const [pafPlaying, setPafPlaying] = useState(false);

    useEffect(() => {
		async function typeSkill(skill: string) {
			for (let i = 0; i <= skill.length; i++) {
				setSkill(skill.slice(0,i));
				await wait(.05);
			}
		}

		async function deleteSkill(skill: string) {
			for (let i = 0; i <= skill.length; i++) {
				setSkill(skill.slice(0,skill.length - i));
				await wait(.03);
			}
		};
		
        const skills = [
            "Web Development",
            "Software Engineering",
            "Database Management", 
            "Game Design",
            "System Administration",
            "Efficiency"
        ]; /* TODO: add more */

		const shuffledSkilled = shuffle(skills);

        let skillIndex = 0;        
        let cancelled = false;
        async function animateSkills() {
            await wait(2);
            while (!cancelled) {
                await typeSkill(shuffledSkilled[skillIndex] + "...");
                await wait(3);
                await deleteSkill(shuffledSkilled[skillIndex] + "...");
                await wait(.2);
                skillIndex = (skillIndex + 1) % shuffledSkilled.length;
            }
        }

        // check if on root page "/"
        if (window.location.pathname === "/") {
            animateSkills();
        }

        return () => { cancelled = true; };
    }, []);

    return (
        <SkillContext value={skill}>
            <PafSkipContext value={[pafSkips, setPafSkips]}>
                <PafPlayingContext value={[pafPlaying, setPafPlaying]}>
                    {children}
                </PafPlayingContext>
            </PafSkipContext>
        </SkillContext>
    )
}