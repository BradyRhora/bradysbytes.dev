"use client";
// this file is a bit messy....
import React, { useRef, useEffect, useState, useCallback, useContext, useLayoutEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";

import BindSibling from "../../wrappers/siblingBinder";
import { getGlowSibling } from "../../wrappers/siblingBinder";
import { PafPlayingContext } from "../../wrappers/contextProviderWrapper";

import styles from "@/app/styles/audioPlayer.module.css";
import Slider from "./slider";
import { getCookie, getEncodedFilePath, setCookie } from "@/scripts/lib/helpers";

type AudioPlayerProps = {
    src: string,
    startTime?: number,  // minimum time allowed to play from
    maxTime?: number,    // maximum time allowed to play from
    cutOffTime?: number | null, // temporary max, extended with each wrong answer
}

export default function HeardleAudioPlayer({src, startTime = 0, maxTime = 0, cutOffTime = null} : AudioPlayerProps) {
    const [glowSibling, setGlowSibling] = useState<HTMLElement|null>(null);
    const [safetyInterval, setSafetyInterval] = useState<NodeJS.Timeout|null>();
    const [volume, setVolume] = useState(1);
    const [currentTimeString, setCurrentTimeString] = useState("0:00");

    const cursorDraggingRef = useRef(false);
    const endTime = useRef(maxTime);
    const audioRef = useRef<HTMLAudioElement>(null);
    const scrubberRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const cutOffRef = useRef<HTMLDivElement>(null);
    const cutOffTimeRef = useRef(cutOffTime);

    const [isPlaying, setIsPlaying] = useContext(PafPlayingContext);

    // Functions
    const timeToRelativePercentage = useCallback((time: number) => {
        if (!audioRef.current) return 0;
        
        let end = audioRef.current?.duration;
        if (maxTime !== 0) end = maxTime;
        const percent = ((time - startTime) / (end - startTime)) * 100;
        return percent;
    }, [maxTime, startTime]);

    // Methods
    let ensureTimeInBounds = useCallback(() => {}, []); // Placeholder for the initial definition

    const toggleAudio = useCallback((forceStop: boolean = false) => {
        // ensure time in bounds on devices that don't call onTimeUpdate frequently
        function doubleCheckInBounds() {
            ensureTimeInBounds();
        }

        if (audioRef.current) {
            const buttonElem = audioRef.current.parentElement?.querySelector('.'+styles.playButton);
            const glowButton = glowSibling?.querySelector('.'+styles.playButton);
            
            if (!buttonElem || !glowButton) return;

            if (!audioRef.current.paused || forceStop) {
                setIsPlaying(false);
                audioRef.current.pause();
                if (safetyInterval) {
                    clearInterval(safetyInterval);
                    setSafetyInterval(null);
                }
            } else {                
                if (
                    (cutOffTime && audioRef.current.currentTime >= cutOffTime) 
                    || (maxTime && audioRef.current.currentTime >= maxTime)
                ) {
                    audioRef.current.currentTime = startTime;
                } 

                setIsPlaying(true);
                audioRef.current.play();
                if (!safetyInterval) setSafetyInterval(setInterval(doubleCheckInBounds, 100)); // Check every 300ms to ensure time is in bounds
            }
        }
    }, [glowSibling, startTime, cutOffTime, maxTime, ensureTimeInBounds, safetyInterval, setIsPlaying]);

    const setCursorPos = useCallback((time: number) => {
        if (cursorRef.current && audioRef.current) {
            const glowCursor = glowSibling?.querySelector('.'+styles.cursor) as HTMLDivElement | null;
            const cursorWidth = cursorRef.current.clientWidth;

            const percent = timeToRelativePercentage(time);

            cursorRef.current.style.left = `calc(${percent}% - ${cursorWidth/2}px)`;
            if (glowCursor) glowCursor.style.left = cursorRef.current.style.left;
        }
    }, [cursorRef, glowSibling, timeToRelativePercentage]);
    
    ensureTimeInBounds = useCallback(() => {        
        const audio = audioRef.current;
        if (audio?.currentTime && audio?.duration) {
            let time = audio.currentTime;

            if (cutOffTimeRef.current && time > cutOffTimeRef.current) {
                toggleAudio(true);
                time = cutOffTimeRef.current;
                audio.currentTime = time;
            } else if (maxTime && time > maxTime) {
                toggleAudio(true);
                time = maxTime;
                audio.currentTime = time;
            } 
            setCursorPos(time);
            const relTime = time - startTime;
            const mins = Math.floor(relTime / 60);
            const secs = Math.floor(relTime - mins*60)
            setCurrentTimeString(`${mins}:${secs.toString().padStart(2,"0")}`)
            
        }
    }, [startTime, maxTime, toggleAudio, setCursorPos]);


    // Mouse Callbacks
    const moveCursorToMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const target = scrubberRef.current;
        const audio = audioRef.current;
        if (!target || !audio) return;

        const rect = target.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        let percent =  mouseX / target.clientWidth;

        percent = Math.min(Math.max(percent, 0), 1);
        
        let time = startTime + (maxTime - startTime) * percent;
        time = Math.round(time * 100) / 100;

        audio.currentTime = time;
        ensureTimeInBounds();
    }, [scrubberRef, ensureTimeInBounds, startTime, maxTime]);

    const updateScrubberCursorOnDrag = useCallback((e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
        moveCursorToMouse(e as React.MouseEvent<HTMLDivElement>);
    }, [moveCursorToMouse]);
    
    function scrubberMouseDownHandler(e: React.MouseEvent<HTMLDivElement>) {
        if (e.button !== 0) return; // Only handle left mouse button

        moveCursorToMouse(e);
        document.addEventListener('mousemove', updateScrubberCursorOnDrag);
        cursorDraggingRef.current = true;
    }

    function pauseButtonHandleClick(e: React.MouseEvent<HTMLDivElement>) {        
        if (e.button === 0) {
            toggleAudio();        
        }
    }

    const releaseCursor = useCallback(() => {
        if (cursorDraggingRef.current) {
            document.removeEventListener('mousemove', updateScrubberCursorOnDrag);
            cursorDraggingRef.current = false;
        }
    }, [updateScrubberCursorOnDrag]);

    // Audio Event Handler
    function audioEndHandler() {
        toggleAudio(true);
    }

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        function handleLoadedMetadata() {
            if (audioRef.current)
                audioRef.current.currentTime = startTime;
        }
        
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);

        return (() => {            
            if (audio) audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        })
    }, [startTime]);

    useEffect(() => {
        if (audioRef.current) {
            // Set initial cut-off cursor position
            if (cutOffTime && cutOffRef.current) {
                const percentage = timeToRelativePercentage(cutOffTime) + "%";
                if (glowSibling) {
                    const glowCutOff = glowSibling.querySelector(`.${styles.cutOff}`) as HTMLElement;
                    if (glowCutOff) {
                        glowCutOff.style.left = percentage;
                    }
                }
                cutOffRef.current.style.left = percentage
            }
        }
        
        document.addEventListener("mouseup", releaseCursor);

        return () => {
            document.removeEventListener("mouseup", releaseCursor);  
        }
    }, [cutOffTime, glowSibling, releaseCursor, timeToRelativePercentage, ensureTimeInBounds]);


    useEffect(() => {
        cutOffTimeRef.current = cutOffTime;
        ensureTimeInBounds();
    }, [cutOffTime, ensureTimeInBounds]);
    
    const didMount = useRef(false);
    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            return;
        }

        if (audioRef.current)
            audioRef.current.volume = volume;

        setCookie("volume", volume.toString());
    }, [volume])

    useLayoutEffect(() => {        
        // Set volume via cookie
        const volCookie = getCookie("volume");
        if (volCookie) setVolume(Number(volCookie));

        if (!audioRef.current) return;

        // Ensure end time exists
        if (endTime.current == 0) endTime.current = audioRef.current.duration;

        // Retrieve glow sibling
        const glowSib = getGlowSibling(audioRef.current.parentElement as HTMLElement);
        if (glowSib) {
            setGlowSibling(glowSib);
        } else {
            console.warn("No glow sibling found for audio player.");
        }
    }, [])

    return (
        <BindSibling hashString={`player-${src}`}>
            <div className={styles.audioPlayer}>
                <audio ref={audioRef} src={getEncodedFilePath(src)} onTimeUpdate={ensureTimeInBounds} onEnded={audioEndHandler}></audio>

        
                <div className={styles.audioContainer}>
                    <div className={styles.audioControls}>            

                        <div onMouseDown={pauseButtonHandleClick} className={`${styles.playButton}`}>
                            {isPlaying ? <FaPause/> : <FaPlay/>}
                        </div>

                        <div ref={scrubberRef} onMouseDown={scrubberMouseDownHandler} className={styles.scrubber}>
                            <div ref={cursorRef} className={`${styles.cursor} ${styles.interactable}`}></div>
                            {cutOffTime && (
                              <div
                                ref={cutOffRef}
                                className={styles.cutOff}
                                style={{ left: "0%" }}
                              ></div>
                            )}
                        </div>
                    </div>

                    <div className={styles.timeVolume}>
                        <div style={{marginLeft:4, fontSize: ".7em"}}>{currentTimeString}/0:09</div>
                        <div className={styles.volumeContainer}><FaVolumeUp/><Slider value={volume} setValue={setVolume} max={1}/></div>
                    </div>
                </div>
            </div>
        </BindSibling>
    )
}