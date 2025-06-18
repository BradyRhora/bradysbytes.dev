import styles from '@/app/styles/main.module.css'
import { wait } from '@/scripts/helpers';
import { useEffect, useState } from 'react'

export default function HeroHeader() {
    const [skill, setSkill] = useState("");

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

    useEffect(() => {
        let cancelled = false;
        const skills = [
            "Web Development",
            "Software Engineering",
            "Database Management", 
            "Game Design",
            "Systems Administration",
            "Efficiency"
        ]; /* add more */

        let skillIndex = 0;        
        async function animateSkills() {
            await wait(5);
            while (!cancelled) {
                await typeSkill(skills[skillIndex] + "...");
                await wait(3);
                await deleteSkill(skills[skillIndex] + "...");
                await wait(.2);
                skillIndex = (skillIndex + 1) % skills.length;
            }
        }

        animateSkills();

        return () => { cancelled = true; };
    }, []);

    return (
        <>
        <h2 className={styles.hero}>IF YOU NEED&nbsp;<i>{skill}</i></h2>
        </>
    )
}