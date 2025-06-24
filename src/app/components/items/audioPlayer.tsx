"use client";
import { createRef, useRef, useEffect, useState, useCallback } from "react";

import BindSibling from "../wrappers/siblingBinder";
import { getGlowSibling } from "../wrappers/siblingBinder";

import styles from "@/app/styles/audioPlayer.module.css";

export default function HeardleAudioPlayer({src} : {src: string}) {
    const [glowSibling, setGlowSibling] = useState<HTMLElement|null>(null)

    const cursorDraggingRef = useRef(false);
    const audioRef = createRef<HTMLAudioElement>();
    const scrubberRef = createRef<HTMLDivElement>();
    const cursorRef = createRef<HTMLDivElement>();

    const setCursorPos = useCallback((time: number) => {
        const maxTime = audioRef.current?.duration;
        if (cursorRef.current && maxTime) {
            const glowCursor = glowSibling?.querySelector('.'+styles.cursor) as HTMLDivElement | null;
            const cursorWidth = cursorRef.current.clientWidth;
            cursorRef.current.style.left = `calc(${(time/maxTime*100)}% - ${cursorWidth/2}px`;
            if (glowCursor) glowCursor.style.left = cursorRef.current.style.left;
        }
    }, [cursorRef, audioRef, glowSibling]);

    const followCursorCallback = useCallback((e : MouseEvent) => {
        const target = scrubberRef.current;
        const audio = audioRef.current;
        if (!target || !audio) return;

        const rect = target.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        let percent =  mouseX / target.clientWidth;

        percent = Math.min(Math.max(percent, 0), 1);
        const time = audio.duration * percent;

        audio.currentTime = time;
        setCursorPos(time);

    }, [scrubberRef, audioRef, setCursorPos]);

    const audioTimeUpdateCallback = useCallback(() => {
        const time = audioRef.current?.currentTime;
        if (time)
            setCursorPos(time);
    }, [audioRef, setCursorPos]);

    function toggleAudio(e: React.MouseEvent<HTMLDivElement>) {
        if (audioRef.current && e.button === 0) {
            const buttonElem = audioRef.current.parentElement?.querySelector('.'+styles.playButton);
            const glowButton = glowSibling?.querySelector('.'+styles.playButton);
            
            if (!buttonElem || !glowButton) return;

            if (audioRef.current.paused) {
                buttonElem.textContent = "⏸";
                glowButton.textContent = "⏸";
                audioRef.current.play();
            } else {
                buttonElem.textContent = "⏵";
                glowButton.textContent = "⏵";
                audioRef.current.pause();
            }
        }
    }

    function dragCursor() {
        document.addEventListener('mousemove', followCursorCallback);
        cursorDraggingRef.current = true;
    }

    const releaseCursor = useCallback(() => {
        if (cursorDraggingRef.current) {
            document.removeEventListener('mousemove', followCursorCallback);
            cursorDraggingRef.current = false;
        }
    }, [followCursorCallback]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.1;
            const glowSib = getGlowSibling(audioRef.current.parentElement as HTMLElement);
            if (glowSib) {
                setGlowSibling(glowSib);
            } else {
                console.warn("No glow sibling found for audio player.");
            }
        }
        
        document.addEventListener("mouseup", releaseCursor);
        return () => document.removeEventListener("mouseup", releaseCursor);
    }, [audioRef, releaseCursor]);

    return (
        <BindSibling hashString={`player-${src}`}>
            <div className={styles.audioPlayer}>
                <audio ref={audioRef} src={src} onTimeUpdate={audioTimeUpdateCallback}></audio>
                <div className={styles.audioControls}>
                    <div onMouseDown={toggleAudio} className={`${styles.playButton}`}>⏵</div>
                    <div className={styles.scrubberContainer}>
                        <div ref={scrubberRef} onMouseDown={dragCursor} className={styles.scrubber}>
                            <div ref={cursorRef} className={`${styles.cursor} ${styles.interactable}`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </BindSibling>
    )
}