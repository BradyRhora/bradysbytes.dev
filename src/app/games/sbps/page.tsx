"use client"
import PageHeader from "@/app/components/items/pageHeader";
import Bracket from "./bracket";
import { useEffect, useState } from "react";
import { SBPSTournament } from "../../../../generated/prisma";

import styles from './sbps.module.css'

export default function SBPS() {
    const [tournament, setTournament] = useState<SBPSTournament>();

    useEffect(() => {
        fetch('/api/SBPS/Tournament')
            .then(data => data.json())
            .then(tournamentObject => {
                setTournament(tournamentObject);
            });
    }, []);

    return (
        <>
        <PageHeader title="SBPS" path={["games"]}/>
        {tournament ? <>
        <h2 className={styles.hero}>{tournament?.name} LIVE BRACKET</h2>
        <Bracket tournamentId={tournament.id}/></> :
        <>No active tournament!</>}
        </>
    )
}