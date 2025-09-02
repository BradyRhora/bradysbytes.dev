"use client";
import React, { createContext, useState, useEffect, useLayoutEffect, useContext } from "react";
import { wait, shuffle } from "@/scripts/lib/helpers";
import { UserContext } from "@/app/mainBody";
import { SBPSTournament } from "../../../../generated/prisma";

export const SkillContext = createContext("");
export const PafSkipContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>]>([0, () => {}]);
export const PafSuccessContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([false, () => {}]);
export const PafOverContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([false, () => {}]);
export const PafPlayingContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([false, () => {}]);
export const ErrorContext = createContext<[string, React.Dispatch<React.SetStateAction<string>>]>(["", () => {}]);
export const SbpsLiveTournamentContext = createContext<[SBPSTournament | undefined, React.Dispatch<React.SetStateAction<SBPSTournament | undefined>>]>([undefined, () => {}]);

export default function ContextProvider({children}: {children: React.ReactNode}) {
    const [user, ] = useContext(UserContext);
    const [skill, setSkill] = useState("");
    const [pafSkips, setPafSkips] = useState(0);
    const [pafSuccess, setPafSuccess] = useState(false);
    const [pafOver, setPafOver] = useState(false);
    const [pafPlaying, setPafPlaying] = useState(false);
    const [error, setError] = useState("");
    const [sbpsLiveTournament, setSbpsLiveTournament] = useState<SBPSTournament>()

    useLayoutEffect(() => {
        if (user) {
            fetch('/api/PAF/skip?user='+user.id)
                .then(res => res.json())
                .then(({skips, success} : {skips:number, success:boolean}) => {
                    setPafSkips(skips);
                    if (success) setPafSuccess(true);
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
        <PafSuccessContext.Provider value={[pafSuccess, setPafSuccess]}>
        <PafOverContext.Provider value={[pafOver, setPafOver]}>
        <PafSkipContext.Provider value={[pafSkips, setPafSkips]}>
        <PafPlayingContext.Provider value={[pafPlaying, setPafPlaying]}>
        <SbpsLiveTournamentContext value={[sbpsLiveTournament, setSbpsLiveTournament]}>
        <ErrorContext.Provider value={[error, setError]}>
            {children}
        </ErrorContext.Provider>
        </SbpsLiveTournamentContext>
        </PafPlayingContext.Provider>
        </PafSkipContext.Provider>
        </PafOverContext.Provider>
        </PafSuccessContext.Provider>
        </SkillContext.Provider>
    )
}