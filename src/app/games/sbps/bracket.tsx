import { useCallback, useEffect, useState } from "react";
import { Prisma } from "../../../../generated/prisma";
import Player from "./player";

import styles from './sbps.module.css';
type MatchWithBasicPlayerInfo = Prisma.SBPSTournamentMatchGetPayload<{
        include: {
            player1: {select: {id: true, tag: true}},
            player2: {select: {id: true, tag: true}},
            winner:  {select: {id: true}}
        }}>;

function BracketMatch({match, style}: {match:MatchWithBasicPlayerInfo, style?: React.CSSProperties}) {
    return (
        <div style={style} className={styles.bracketMatch}>
            <div className={styles.bracketPlayer}>
                {match.player1 ? <>
                    <Player id={match.player1.id} tag={match.player1.tag}/>
                    <span className={`${styles.bracketScore} ${match.winner && match.winner.id == match.player1.id ? styles.bracketWinnerScore : ''}`}>{match.score1}</span>
                </> : "N/A"}
            </div>
            <div className={styles.bracketPlayer}>
                {match.player2 ? <>
                <Player id={match.player2.id} tag={match.player2.tag}/>
                <span className={`${styles.bracketScore} ${match.winner && match.winner.id == match.player2.id ? styles.bracketWinnerScore : ''}`}>{match.score2}</span>
                </> : "N/A"}
            </div>
        </div>
    )
}

export default function Bracket({tournamentId} : {tournamentId: string}) {
    const [matches, setMatches] = useState<MatchWithBasicPlayerInfo[]>([]);
    const [rounds, setRounds] = useState<MatchWithBasicPlayerInfo[][]>([]);

    const getMatchByID = useCallback((id: string) => {
        const match = matches?.filter(m => m.id == id);
        return match && match.length > 0 ? match[0] : undefined;
    }, [matches]);


    useEffect(() => {
        fetch('/api/SBPS/TournamentMatches?id='+tournamentId)
            .then(data => data.json())
            .then(tournamentMatches => {
                setMatches(tournamentMatches);
            });
    }, [tournamentId])

    useEffect(() => {
        if (matches.length == 0) return;
        const roundCount = matches[matches.length-1].round;
        const rounds = [matches.filter(m => m.round == 1)]
        for (let r = 0; r < roundCount - 1; r++) {
            const currentRound : MatchWithBasicPlayerInfo[] = []
            for (let i = 0; i < rounds[r].length; i += 2) {
                const nextMatchId = rounds[r][i].nextMatchId;
                if (nextMatchId) {
                    const nextMatch = getMatchByID(nextMatchId);
                    if (nextMatch) currentRound.push(nextMatch);
                }
            }
            rounds.push(currentRound);
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
                            const marginSize = (match.round-1) * 45;
                            return <BracketMatch style={{marginTop: marginSize, marginBottom: marginSize}} key={match.id} match={match}/>
                        })
                    }
                    </div>
                )
            })}
        </div>
    )
}