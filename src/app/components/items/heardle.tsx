"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

import cardStyles from "@/app/styles/card.module.css";
import styles from "@/app/styles/paf.module.css";
import { Card } from "./cards";
import { Terminal } from "@/scripts/terminal";

export default function Heardle() {
    type songDataProps = {
        songPath: string,
        meta: {
            title: string,
            artist: string,
            date: string|null,
            imageData: string|null
        }
    }

    const [songData, setSongData] = useState<songDataProps|null>(null);
    const [image, setImage] = useState<string|null>(null);

    useEffect(() => {
        Terminal.instance.skipIntro = true;
        fetch("/api/songInfo")
        .then(res => res.json())
        .then(data => {
            setSongData(data);
        
            // convert img data
            if (data.meta.imageData) {
                const mimeType = 'image/jpeg';
                const dataUrl = `data:${mimeType};base64,${data.meta.imageData}`;
                setImage(dataUrl);
            }
        })

        // hide terminal
        
        return (() => {
            Terminal.instance.skipIntro = false;
            // unhide terminal
        })
    }, []);

    return (
        <Card className={`${cardStyles.wide}`}>
            {/* Song Player Here - Starts from a random (same for everyone) point in the song */}
            

            {/* Guessing Box Here - Player enters text and song list is checked for fuzzy matches and returned via API */}

            <Card className={`${styles["todays-song"]} ${cardStyles.closed}`}>
                <div className={styles["song-info"]}>
                    {songData && 
                        <>
                        <h2>{songData.meta.title}</h2>
                        <span><i>{songData.meta.artist} {songData.meta.date && `- ${songData.meta.date}`}</i></span>
                        <audio className={styles["song-info-player"]} controls>
                            <source src={`songs/${songData.songPath}`} type="audio/mpeg"/>
                        </audio>
                        </>
                    }
                </div>
                {image &&
                    <Image className={styles["album-cover"]} width={250} height={250} alt="Album cover." src={image}></Image>
                }
            </Card>
        </Card>
    )
}