"use client"
import Image from "next/image";
import { useLayoutEffect, useEffect, useState, useContext } from "react";

import { Card } from "./cards";
import HeardleAudioPlayer from "./audioPlayer";

import { Terminal } from "@/scripts/terminal";
import { PafSkipContext } from "@/app/components/wrappers/contextProviderWrapper";

import cardStyles from "@/app/styles/card.module.css";
import styles from "@/app/styles/paf.module.css";
import HeardleGuesser from "./heardleGuesser";
import { roundToDecimalPlaces } from "@/scripts/lib/helpers";

import { CUTOFF_INCREASE, MAX_SKIPS } from "@/scripts/lib/db";

export default function Heardle() {
    type songDataProps = {
        songPath: string,
        startTime: number,
        meta: {
            title: string,
            artist: string,
            date: string|null,
            imageData: string|null
        }
    }


    const [skips, setSkips] = useContext(PafSkipContext);
    const [over, setOver] = useState(false);
    const [songData, setSongData] = useState<songDataProps>({songPath:"", startTime:0, meta:{title:"",artist:"",date:null,imageData:null}});
    const [image, setImage] = useState<string|null>(null);

    function skip() {
        setSkips(skips + 1);
    }

    function getCutoffTime(skips : number) {
        let time = songData.startTime + (skips * CUTOFF_INCREASE) + 1;
        if (time > songData.startTime + 12) time = songData.startTime + 12;
        return roundToDecimalPlaces(time, 5);
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
    }, []);

    useEffect(() => {
        if (MAX_SKIPS - skips < 0) setOver(true);
        Terminal.instance.skipIntro = true;
        
        return (() => {
            Terminal.instance.skipIntro = false;
        })
    }, [skips])

    return (
        <Card className={`${cardStyles.wide} ${styles.container}`}>            
            {songData.songPath && <>
                <div className={styles.playerContainer}>
                    <HeardleAudioPlayer src={songData.songPath} startTime={songData.startTime} cutOffTime={getCutoffTime(skips)} maxTime={roundToDecimalPlaces(songData.startTime + ((MAX_SKIPS * CUTOFF_INCREASE) + 1), 5)}/>                
                    {!over && <button id="skipButton" onClick={skip}>{skips < MAX_SKIPS ? `Skip (${MAX_SKIPS - skips})` : `Give Up`}</button>}
                </div>

                {!over && <HeardleGuesser/>}

                {over &&
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
                }
            </> }
        </Card>
    )
}