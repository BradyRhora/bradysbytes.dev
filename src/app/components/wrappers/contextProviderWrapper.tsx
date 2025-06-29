"use client";
import React, { createContext, useState, useEffect, useLayoutEffect, useContext } from "react";
import { wait, shuffle } from "@/scripts/lib/helpers";
import { UserContext } from "./mainBody";

export const SkillContext = createContext("");
export const PafSkipContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>]>([0, () => {}]);
export const PafPlayingContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([false, () => {}]);
export const ErrorContext = createContext<[string, React.Dispatch<React.SetStateAction<string>>]>(["", () => {}]);

export default function ContextProvider({children}: {children: React.ReactNode}) {
    const [user, ] = useContext(UserContext);
    const [skill, setSkill] = useState("");
    const [pafSkips, setPafSkips] = useState(0);
    const [pafPlaying, setPafPlaying] = useState(false);
    const [error, setError] = useState("");

    useLayoutEffect(() => {
        if (user) {
            fetch('/api/skip?user='+user.id)
                .then(res => res.json())
                .then(({skips} : {skips:number}) => {
                    setPafSkips(skips);
                });
        }
    }, [user])

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

        animateSkills();
        
        return () => { cancelled = true; };
    }, []);

    return (
        <SkillContext.Provider value={skill}>
            <PafSkipContext.Provider value={[pafSkips, setPafSkips]}>
                <PafPlayingContext.Provider value={[pafPlaying, setPafPlaying]}>
                    <ErrorContext.Provider value={[error, setError]}>
                        {children}
                    </ErrorContext.Provider>
                </PafPlayingContext.Provider>
            </PafSkipContext.Provider>
        </SkillContext.Provider>
    )
}