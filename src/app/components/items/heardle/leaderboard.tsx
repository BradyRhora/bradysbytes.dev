"use client"

import { useEffect, useState } from "react";
import { FaCrown, FaSkull } from "react-icons/fa";

import { User, UserPerformance } from "../../../../../generated/prisma";
import { Card } from "../cards";

import styles from "@/app/styles/paf.module.css"

export default function Leaderboard() {
    type LeaderboardEntry = UserPerformance & { user: User };
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]|null>(null);

    useEffect(() => {
        fetch('/api/Leaderboard')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data)
                    setLeaderboard(data);
            });
    }, []);

    return (
        <Card className={styles.leaderboardContainer}>
            <h3>Today&apos;s Leaderboard</h3>
            {leaderboard ? 
            <ol>
            {leaderboard.map((performance, index) => {
                return (<li key={index}><div style={{marginRight: 50}}>{performance.success ? index == 0 && <FaCrown/> : <FaSkull/>} {performance.user.name}</div> {performance.skipsUsed} skips</li>);
            })}
            </ol>
            :
            <span>No one yet! You could be the first!</span>}
        </Card>
    )
}