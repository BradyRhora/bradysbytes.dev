"use client"
import { useContext } from 'react';
import { SkillContext } from './contextProvider'
import styles from '@/app/styles/main.module.css'

export default function HeroHeader() {
    const skill = useContext(SkillContext);
    
    return (
        <div className={styles.heroContainer}>
            <h2>IF YOU NEED</h2>
            <h2 className={styles.heroSkill}><i>{skill}</i></h2>
        </div>
    )
}