"use client"

import { useEffect, useState } from "react";
import { FaCrown, FaSkull } from "react-icons/fa";

import { User, UserPerformance } from "../../../../generated/prisma";
import { Card } from "../../components/items/cards";

import styles from "@/app/styles/paf.module.css"

export default function Leaderboard() {
    type LeaderboardEntry = UserPerformance & { user: User };
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]|null>(null);

    useEffect(() => {
        fetch('/api/PAF/Leaderboard')
            .then(res => res.json())
            .then(data => {
                if (data)
                    setLeaderboard(data);
            });
    }, []);

    return (
        <Card className={styles.leaderboardContainer}>
            <h3>Today&apos;s Leaderboard</h3>
            {leaderboard && leaderboard.length > 0 ? 
            <ol>
            {leaderboard.map((performance, index) => {
                return (<li key={index}><div style={{marginRight: 50}}>{index+1}. {performance.success ? index == 0 && <FaCrown fill="gold" style={{paddingTop: 5}}/> : <FaSkull fill="red" style={{paddingTop: 5}}/>}{performance.user.name}</div> {Math.min(5, performance.skipsUsed)} skips</li>);
            })}
            </ol>
            :
            <span style={{fontSize:".7em"}}>No one yet! You could be the first!</span>}
        </Card>
    )
}