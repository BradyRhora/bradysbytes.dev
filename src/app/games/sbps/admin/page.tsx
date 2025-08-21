"use client";
import { RefObject, useEffect, useRef, useState } from "react";
import { Prisma, SBPSSeries } from "../../../../../generated/prisma";
import PageHeader from "@/app/components/items/pageHeader";

type PlayerWithRelations = Prisma.SBPSPlayerGetPayload<{include:{main: true, secondary:true}}>;
type CharacterWithRelations = Prisma.SBPSCharacterGetPayload<{include:{series:true}}>;

export default function SBPSAdmin() {
    const seriesRef = useRef<HTMLTextAreaElement|null>(null);
    const characterRef = useRef<HTMLTextAreaElement|null>(null);
    const playerRef = useRef<HTMLTextAreaElement|null>(null);

    const [characters, setCharacters] = useState<CharacterWithRelations[]>([]);
    const [series, setSeries] = useState<SBPSSeries[]>([]);
    const [players, setPlayers] = useState<PlayerWithRelations[]>([]);

    function importData(ref: RefObject<HTMLTextAreaElement|null>, dest: string) {
        if (ref.current && ref.current.value) {
            fetch('/api/SBPS/' + dest, {method:'POST', body:ref.current.value})
                .then(res => res.json())
                .then((data) => {
                    console.log(data);
                })
        }
    }

    function lerpRedGreen(t: number, scale : number = 2, reversed : boolean = false) {
        t = t/scale;
        const r = Math.round(255 * (reversed ? t : 1 - t));
        const g = Math.round(255 * (reversed ? 1 - t : t));
        return `rgb(${r},${g},0)`;
    }

    useEffect(() => {
        fetch('/api/SBPS/Character')
        .then((res) => res.json())
        .then((data) => {
            setCharacters(data);
        });
    }, [])

    useEffect(() => {
        fetch('/api/SBPS/Player')
        .then((res) => res.json())
        .then((data) => {
            setPlayers(data);
        });
    }, [])

    
    useEffect(() => {
        fetch('/api/SBPS/Series')
        .then((res) => res.json())
        .then((data) => {
            setSeries(data);
        });
    }, [])

    return (
        <div style={{margin:"10px"}}>
            <PageHeader title={"Admin Panel (SUPER SECRET!)"} path={['games','sbps']}/>
            <h2>Characters</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Range</th>
                        <th>Weight</th>
                        <th>Power</th>
                        <th>Speed</th>
                        <th>Weapon Size</th>
                        <th>Sex Appeal</th>
                        <th>Style</th>
                        <th>Colour</th>
                        <th>Blurb</th>
                        <th>Series ID</th>
                    </tr>
                </thead>
                <tbody>
                {
                characters && characters.map((character) => {
                    return (
                        <tr key={character.id}>
                            <td>{character.id}</td>
                            <td>{character.name}</td>
                            <td style={{backgroundColor:lerpRedGreen(character.range)}}>{character.range}</td>
                            <td style={{backgroundColor:lerpRedGreen(character.weight)}}>{character.weight}</td>
                            <td style={{backgroundColor:lerpRedGreen(character.power)}}>{character.power}</td>
                            <td style={{backgroundColor:lerpRedGreen(character.speed)}}>{character.speed}</td>
                            <td style={{backgroundColor:lerpRedGreen(character.weapon_size ?? 0)}}>{character.weapon_size}</td>
                            <td style={{backgroundColor:lerpRedGreen(character.sex_appeal)}}>{character.sex_appeal}</td>
                            <td style={{backgroundColor:lerpRedGreen(character.style)}}>{character.style}</td>
                            <td style={{backgroundColor:character.colour}}>{character.colour}</td>
                            <td style={{maxWidth:'450px'}}>{character.blurb}</td>
                            <td>{`${character.series.name} (${character.series.releaseYear})`}</td>
                        </tr>
                    )
                })
                }
                </tbody>
            </table>

            <textarea 
                ref={characterRef}
                style={{width:'600px',height:'100px',margin:'10px',resize:'none'}}
                id={'characterCSVImport'}
                placeholder={"name,range,weight,power,speed,weaponSize,sexAppeal,style,#000000,blurb,seriesID"}                
            ></textarea>
            <br/>
            <button onClick={() => importData(characterRef, 'Character')}>Import CSV</button>

            <h2>Game Series</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Genre</th>
                        <th>Release Year</th>
                    </tr>
                </thead>
                <tbody>
                {
                series && series.map((series) => {
                    return (
                        <tr key={series.id}>
                            <td>{series.id}</td>
                            <td>{series.name}</td>
                            <td>{series.genre}</td>
                            <td>{series.releaseYear}</td>
                        </tr>
                    )
                })
                }
                </tbody>
            </table>

            <textarea 
                ref={seriesRef}
                style={{width:'600px',height:'100px',margin:'10px',resize:'none'}}
                id={'seriesCSVImport'}
                placeholder={"name,year,genre"}
            ></textarea>
            <br/>
            <button onClick={() => importData(seriesRef, 'Series')}>Import CSV</button>

            <h2>Players</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tag</th>
                        <th>Name</th>
                        <th>Main</th>
                        <th>Secondary</th>
                        <th>Weight</th>
                        <th>Stink</th>
                        <th>Charm</th>
                        <th>Anger</th>
                        <th>Depression</th>
                        <th>Intoxication</th>
                        <th>Finger Count</th>
                        <th>Coordination</th>
                        <th>Intelligence</th>
                        <th>Tech Skill</th>
                    </tr>
                </thead>
                <tbody>
                {
                players && players.map((player) => {
                    return (
                        <tr key={player.id}>
                            <td>{player.id}</td>
                            <td>{player.tag}</td>
                            <td>{player.name}</td>
                            <td>{player.main.name}</td>
                            <td>{player.secondary ? player.secondary.name : "N/A"}</td>
                            <td style={{backgroundColor:lerpRedGreen(player.weight)}}>{player.weight}</td>
                            <td style={{backgroundColor:lerpRedGreen(player.stink)}}>{player.stink}</td>
                            <td style={{backgroundColor:lerpRedGreen(player.charm)}}>{player.charm}</td>
                            <td style={{backgroundColor:lerpRedGreen(player.anger)}}>{player.anger}</td>
                            <td style={{backgroundColor:lerpRedGreen(player.depression,2,true)}}>{player.depression}</td>
                            <td style={{backgroundColor:lerpRedGreen(player.intoxication)}}>{player.intoxication}</td>
                            <td style={{backgroundColor:lerpRedGreen(player.fingerCount,10)}}>{player.fingerCount}</td>
                            <td style={{backgroundColor:lerpRedGreen(player.coordination)}}>{player.coordination}</td>
                            <td style={{backgroundColor:lerpRedGreen(player.intelligence)}}>{player.intelligence}</td>
                            <td style={{backgroundColor:lerpRedGreen(player.techSkill)}}>{player.techSkill}</td>
                        </tr>
                    )
                })
                }
                </tbody>
            </table>
            
            <textarea 
                ref={playerRef}
                style={{width:'600px',height:'100px',margin:'10px',resize:'none'}}
                id={'playerCSVImport'}
                placeholder={"tag,name,mainID,secondaryID?,weight,stink,charm,anger,depression,intoxication,fingerCount,coordination,intelligence,techSkill"}
                
            ></textarea>
            <br/>
            <button onClick={() => importData(playerRef, 'Player')}>Import CSV</button>

            <style>{`
                table, th, td {
                    border: solid 1px white;
                    border-collapse: collapse;
                    padding:3px;
                    max-width:80%;
                }
            `}</style>
        </div>
    )
}