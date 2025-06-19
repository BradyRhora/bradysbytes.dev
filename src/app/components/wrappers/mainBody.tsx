"use client"
import { useEffect, useLayoutEffect, useState } from "react";

import { setup } from "@/scripts/terminal";
import { hookAsteroidEvents } from "@/scripts/asteroids";
import { startTerminal } from "@/scripts/pageFunctions";
import { shuffle, wait } from "@/scripts/helpers";

import GlowWrapper from "./glowWrapper";
import TerminalComponent from "../terminal";
import { SkillContext } from "../contextProvider";

export default function MainBody({children,}: Readonly<{children: React.ReactNode;}>) {
	
	const [skill, setSkill] = useState("");

	useLayoutEffect(() => {
		startTerminal();
		async function runSetup() {
        	await setup();
		}
		runSetup();
		hookAsteroidEvents();
	}, []);

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
            "Systems Administration",
            "Efficiency"
        ]; /* add more */

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

        animateSkills();

        return () => { cancelled = true; };
    }, []);

    return (
        <>
		<SkillContext value={skill}>
			<GlowWrapper>
			{children}
			</GlowWrapper>
		</SkillContext>
		<TerminalComponent/>
        </>
    );
}