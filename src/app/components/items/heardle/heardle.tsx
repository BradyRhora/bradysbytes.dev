"use client"
import Image from "next/image";
import { useLayoutEffect, useEffect, useState, useContext, useRef } from "react";

import { Card } from "../cards";
import HeardleAudioPlayer from "./audioPlayer";

import { Terminal } from "@/scripts/terminal";
import { ErrorContext, PafOverContext, PafSkipContext, PafSuccessContext } from "@/app/components/wrappers/contextProviderWrapper";
import { UserContext } from "../../wrappers/mainBody";

import cardStyles from "@/app/styles/card.module.css";
import styles from "@/app/styles/paf.module.css";
import HeardleGuesser from "./heardleGuesser";
import { roundToDecimalPlaces, setCookie } from "@/scripts/lib/helpers";
import { CUTOFF_INCREASE, MAX_SKIPS } from "@/scripts/lib/db";

import { User } from "@/../generated/prisma";

export default function Heardle() {
    type songDataProps = {
        songPath: string,
        startTime: number,
        dayIndex: number
        meta: {
            title: string,
            artist: string,
            date: string|null,
            imageData: string|null
        }
    }

    const [skips, setSkips] = useContext(PafSkipContext);
    const [success, setSuccess] = useContext(PafSuccessContext);
    const [over, setOver] = useContext(PafOverContext);
    const [error, setError] = useContext(ErrorContext);
    const [user, setUser] = useContext(UserContext);

    const [songData, setSongData] = useState<songDataProps>({songPath:"", startTime:0, dayIndex: 0, meta:{title:"",artist:"",date:null,imageData:null}});
    const [image, setImage] = useState<string|null>(null);

    const nameInputRef = useRef<HTMLInputElement>(null);

    /*
    function isSafari() {
        const ua = navigator.userAgent;
        return (
            /Safari/.test(ua) &&
            !/Chrome|CriOS|Chromium|Android/.test(ua)
        );
    }
    */
   
    function skip() {
        if (user) {
            fetch('/api/skip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: user.id })
            })
            .then(res => res.json())
            .then((data: {skips: number}) => {
                if (skips + 1 > MAX_SKIPS) setOver(true);
                else setSkips(data.skips);
            })
        } else {
            if (skips + 1 > MAX_SKIPS) setOver(true);
            else setSkips(skips + 1);
        }
    }

    function getCutoffTime(skips : number) {
        let time = songData.startTime + (skips * CUTOFF_INCREASE) + 1;
        if (time > songData.startTime + 12) time = songData.startTime + 12;
        return roundToDecimalPlaces(time, 5);
    }

    function copyResults() {
        const results = `🎧 Phineas and Ferbdle - Day ${songData.dayIndex+1} Results 🎧\n\nSkips needed: ${skips}\n${success ? "Got it! ✅" : "Didn't know it... ❌"}`;
        navigator.clipboard.writeText(results);
    }

    async function submitName() {
        if (nameInputRef.current) {
            const name = nameInputRef.current.value;
            if (name.length < 3) {
                setError("Name must be at least 3 characters");
                return;
            }

            fetch('/api/ChooseName?name=' + nameInputRef.current.value)
                .then(res => res.json())
                .then((userData: User) => {
                    setUser(userData);
                    setCookie("user",userData.id);
                });
        }
    }

    useLayoutEffect(() => {
        fetch("/api/SongInfo")
        .then(res => res.json())
        .then(data => {
            setSongData(data);
        
            // convert img data
            if (data.meta.imageData) {
                setImage(data.meta.imageData);
            }
        })       
    }, [setUser]);

    useEffect(() => {        
        Terminal.instance.skipIntro = true;
        if (skips > MAX_SKIPS || success) setOver(true);
        
        return (() => {
            Terminal.instance.skipIntro = false;
        })
    }, [skips, setSuccess, success])

    return (
        <Card className={`${cardStyles.wide} ${styles.container}`}>
            {/* isSafari() && 
                <p style={{marginTop:0,textAlign:'center', fontSize:12}}>Some Safari versions may have issues with playback. Update or try another browser if you experience issues!</p>
            bugged */} 

            {songData.songPath ? 
            <>
                <div className={styles.playerContainer}>
                    <HeardleAudioPlayer src={songData.songPath} startTime={songData.startTime} cutOffTime={getCutoffTime(skips)} maxTime={roundToDecimalPlaces(songData.startTime + ((MAX_SKIPS * CUTOFF_INCREASE) + 1), 5)}/>                
                    {!over && <button id="skipButton" onClick={skip}>{skips < MAX_SKIPS ? `Skip (${MAX_SKIPS - skips})` : `Give Up`}</button>}
                </div>

                {!over && <HeardleGuesser/>}

                {over && <>
                    <Card className={`${styles["todays-song"]}`}>
                        <div className={styles["song-info"]}>
                            {songData && 
                                <>
                                <h2>{songData.meta.title}</h2>
                                <span><i>{songData.meta.artist} {songData.meta.date && `- ${songData.meta.date.slice(0,4)}`}</i></span>
                                <audio className={styles["song-info-player"]} controls>
                                    <source src={songData.songPath} type="audio/mpeg"/>
                                </audio>
                                </>
                            }
                        </div>
                        {image &&
                            <Image className={styles["album-cover"]} width={250} height={250} alt="Album cover" src={image}></Image>
                        }
                    </Card>
                    
                    <div className={styles.resultsContainer}>
                        { success ? <>
                        <div>Nice one! You got it with <span style={{color:"green"}}>{skips}</span> skips.</div>
                        </>:<>
                        <div>Too bad! Try again tomorrow!</div>
                        </>}                        
                        <div>Click <button onClick={copyResults}>here</button> to copy your results to your clipboard.</div>
                    </div>
                </>
                }

                {!user && 
                <Card className={styles.nameInputContainer}>
                    <h2>Enter a nickname to save your stats:</h2>
                    <div className={styles.nameInputs}>
                        <input ref={nameInputRef} maxLength={30} className={styles.nameInput}></input>
                        <button onClick={submitName}>Confirm</button>
                    </div>
                    {error && <div style={{color:"red",textAlign:"center",marginTop:20}}>{error}</div>}
                </Card>
                }
            </> : <div style={{margin:20}}>
                Loading song...
            </div>
            }
        </Card>
    )
}