"use client"
import PageHeader from "@/app/components/items/pageHeader";
import Bracket from "./bracket";
import { useEffect, useCallback, useRef, useContext, useState } from "react";

import styles from './sbps.module.css'
import { isGlowElement } from "@/scripts/lib/helpers";
import { SbpsLiveTournamentContext } from "@/app/components/wrappers/contextProviderWrapper";


const isDevelopment = process.env.NODE_ENV === 'development';

export default function SBPS() {
    const sbpsPageRef = useRef<HTMLDivElement>(null);
    const wsRetry = useRef(0);
    const [tournament, setTournament] = useContext(SbpsLiveTournamentContext);
    const [live, setLive] = useState(false);

    const getTournament = useCallback((id: string) => {
        fetch('/api/SBPS/Tournament?id='+id)
            .then(data => data.json())
            .then(tournamentObject => {
                setTournament(tournamentObject);
            });
    }, [setTournament]);

    const getActiveTournament = useCallback(() => {
        fetch('/api/SBPS/Tournament')
            .then(data => data.json())
            .then(tournamentObject => {
                setTournament(tournamentObject);
            });
    }, [setTournament]);

    const connectWebSocket = useCallback(() => {
        const wsUrl = isDevelopment ? "ws://localhost:5975" : "wss://bradysbytes.dev:5975";
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => { // TODO: after connecting, ensure still connected in interval?
            setLive(true);
            wsRetry.current = 0;
            console.log("Successfully connected to WebSocketServer at " + wsUrl);
        }

        ws.close = () => {
            setLive(false);
            console.log(`WebSocket connection closed. Attempting reconnect in ${wsRetry.current * 10} seconds...`);
            setTimeout(() => {
                connectWebSocket();
            }, wsRetry.current * 10 * 1000);
            wsRetry.current += 1;
        }
        
        ws.onerror = (error) => {
            console.log("WebSocket error:", error);
            console.log(`Attempting to reconnect in ${wsRetry.current * 10} seconds...`);
            setTimeout(() => {
                connectWebSocket();
            }, wsRetry.current * 10 * 1000);
            wsRetry.current += 1;
        };

        ws.onmessage = (event) => {
            console.log("Message received from WSS!");
            if (typeof event.data === "string") {
                const msg = JSON.parse(event.data);
                if (msg.type == "newTournament") {
                    getTournament(msg.tournamentId);
                }
            }
        };

        return ws;
    }, [getTournament]);

    useEffect(() => {
        getActiveTournament();
    }, [getActiveTournament]);

    useEffect(() => {
        if (sbpsPageRef.current && isGlowElement(sbpsPageRef.current)) return;
        const ws = connectWebSocket();

        return () => {
            ws.close();
        }
    }, [connectWebSocket]);

    return (
        <div ref={sbpsPageRef}>
        <PageHeader title="SBPS" path={["games"]}/>
        {tournament ? <>
        <h2 className={styles.hero}>{tournament?.name} {live && (<><span style={{margin:0,padding:0,fontSize:50, color:'red'}}>•</span>LIVE</>)} BRACKET</h2>
        <Bracket tournamentId={tournament.id}/></> :
        <>No active tournament!</>}
        </div>
    )
}