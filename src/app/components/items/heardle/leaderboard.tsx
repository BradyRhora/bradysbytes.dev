"use client"

import { useEffect, useState } from "react";
import { FaCrown, FaSkull, FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { User, UserPerformance } from "../../../../../generated/prisma";
import { Card } from "../cards";

import styles from "@/app/styles/paf.module.css"

export default function Leaderboard() {
    type LeaderboardEntry = UserPerformance & { user: User };
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]|null>(null);
    const [offset, setOffset] = useState(0);
    const [title, setTitle] = useState("Today");

    function offsetBack() {
        setOffset(offset+1);
    }

    function offsetForward() {
        if (offset == 0) return;
        setOffset(offset-1);
    }

    useEffect(() => {
        if (offset == 0) setTitle("Today");
        else if (offset == 1) setTitle("Yesterday");
        else setTitle(`${offset} Days Ago`)
        fetch(`/api/Leaderboard?offset=${offset}`)
            .then(res => res.json())
            .then(data => {
                if (data)
                    setLeaderboard(data);
            });
    }, [offset]);

    return (
        <Card className={styles.leaderboardContainer}>
            <h3>{title}&apos;s Leaderboard</h3>
            {leaderboard && leaderboard.length > 0 ? 
            <ol>
            {leaderboard.map((performance, index) => {
                return (<li key={index}><div style={{marginRight: 50}}>{index+1}. {performance.success ? index == 0 && <FaCrown fill="gold" style={{paddingTop: 5}}/> : <FaSkull fill="red" style={{paddingTop: 5}}/>}{performance.user.name}</div> {Math.min(5, performance.skipsUsed)} skips</li>);
            })}
            </ol>
            :
            <span style={{fontSize:".7em"}}>No one yet! You could be the first!</span>}
            <div className={styles.offsetControls}>
                <FaArrowLeft onClick={offsetBack}></FaArrowLeft>
                <FaArrowRight onClick={offsetForward}></FaArrowRight>
            </div>
        </Card>
    )
}