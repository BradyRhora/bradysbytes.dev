import { HTMLAttributes, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Prisma } from "../../../../../generated/prisma";
import Player from "./player";

import styles from '../sbps.module.css';

type MatchWithBasicPlayerInfo = Prisma.SBPSTournamentMatchGetPayload<{
    include: {
        player1: {select: {id: true, tag: true}},
        player2: {select: {id: true, tag: true}},
        winner:  {select: {id: true}}
    }
}>;

function BracketMatch({match, style, className}: {match:MatchWithBasicPlayerInfo, style?: React.CSSProperties, className?: string}) {
    const matchRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={matchRef} style={style} data-match-id={match.id} className={`${styles.bracketMatch} ${className}`}>
            <div className={styles.bracketPlayer}>
                {match.player1 ? <>
                    <Player id={match.player1.id} tag={match.player1.tag}/>
                    <span className={`${styles.bracketScore} ${match.winner && match.winner.id == match.player1.id ? styles.bracketWinnerScore : ''}`}>{match.score1}</span>
                </> : <><span></span><span style={{opacity:0}}>0</span></>}
            </div>
            <div className={styles.bracketPlayer}>
                {match.player2 ? <>
                <Player id={match.player2.id} tag={match.player2.tag}/>
                <span className={`${styles.bracketScore} ${match.winner && match.winner.id == match.player2.id ? styles.bracketWinnerScore : ''}`}>{match.score2}</span>
                </> : <><span></span><span className={styles.bracketScore} style={{opacity:0}}>0</span></>}
            </div>
        </div>
    )
}

export default function Bracket({tournamentId} : {tournamentId: string}) {
    const [currentMatchId, setCurrentMatchId] = useState<string|undefined>(undefined);
    const [matches, setMatches] = useState<MatchWithBasicPlayerInfo[]>([]);
    const [rounds, setRounds] = useState<MatchWithBasicPlayerInfo[][]>([]);

    const getMatchByID = useCallback((id: string) => {
        const match = matches?.filter(m => m.id == id);
        return match && match.length > 0 ? match[0] : undefined;
    }, [matches]);

    useEffect(() => {
        fetch('/api/sbps/tournament/currentmatch')
            .then(data => data.json())
            .then(match => {
                setCurrentMatchId(match.id);
            });
    }, []);

    useEffect(() => {
        function updateBracket() {
            fetch('/api/sbps/tournament/matches?id='+tournamentId)
                .then(data => data.json())
                .then(tournamentMatches => {
                    setMatches(tournamentMatches);
                });
        }

        updateBracket();
        
        /*
        const interval = setInterval(() => {
            updateBracket();
        }, 1000 * 10);
        

        return () => clearInterval(interval);
        */
    }, [tournamentId])

    useEffect(() => {
        if (matches.length == 0) return;

        const roundCount = matches[matches.length-1].round;
        const rounds = [matches.filter(m => m.round == 1).sort((a, b) => a.number - b.number)]
        
        for (let r = 0; r < roundCount - 1; r++) {
            const currentRound : MatchWithBasicPlayerInfo[] = []

            for (let i = 0; i < rounds[r].length; i += 2) {
                const nextMatchId = rounds[r][i].nextMatchId;

                if (nextMatchId) {
                    const nextMatch = getMatchByID(nextMatchId);
                    if (nextMatch) currentRound.push(nextMatch);
                }
            }

            rounds.push(
              currentRound.sort(
                (a, b) => a.number - b.number
              )
            );
        }
        setRounds(rounds);
    }, [matches, getMatchByID])

    return (
        <div className={styles.tournamentBracket}>
            {rounds.length > 0 && rounds.map((round) => {
                return (
                    <div className={styles.bracketRound} key={round[0].round}>
                    {
                        round.map((match) => {
                            const marginSize = (((match.round-1) ** 1.5) * 60) + 5;
                            return <BracketMatch className={currentMatchId == match.id ? styles.currentMatch : undefined} style={{marginTop: marginSize, marginBottom: marginSize}} key={match.id} match={match}/>
                        })
                    }
                    </div>
                )
            })}
        </div>
    )
}