import React, { useState, useRef, useContext } from "react";

import DropdownBox from "../../wrappers/dropdownBox";
import { PafSkipContext, PafSuccessContext } from "@/app/components/wrappers/contextProviderWrapper";
import BindSibling, { getGlowSibling } from "../../wrappers/siblingBinder";

import styles from "@/app/styles/paf.module.css"
import dropdownStyles from "@/app/styles/semiComponents.module.css"
import { UserContext } from "../../wrappers/mainBody";

export default function HeardleGuesser() {
    type basicSongInfo = {
        title: string,
        id: string,
        artist: string
    }

    const [user,] = useContext(UserContext);
    const [skips, setSkips] = useContext(PafSkipContext);
    const [, setSuccess] = useContext(PafSuccessContext);
    const [songs, setSongs] = useState<basicSongInfo[]>([]);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searching = useRef(false);

    function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const input = e.target.value.trim();

        if (searchTimeoutRef.current) 
            clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(async () => {
            await getSongs(input);
            
            const dropdown = e.target.parentElement?.querySelector("." + styles.guessDropdown);
            if (dropdown != null) {
                if (searching.current) { 
                    const glowDropdown = getGlowSibling(dropdown as HTMLElement);
                    glowDropdown?.classList.add(dropdownStyles.dropdownOpen);
                } else {
                    const glowDropdown = getGlowSibling(dropdown as HTMLElement);
                    glowDropdown?.classList.remove(dropdownStyles.dropdownOpen);
                }
            }
        }, 400);
    }

    function skip() {
        if (user) {
            fetch('/api/skip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: user.id })
            })
            .then(res => res.json())
            .then((data: {skips: number}) => {
                setSkips(data.skips);
            })
        } else {
            setSkips(skips + 1);
        }
    }

    async function guess(e: React.MouseEvent, id: string) {
        if (e.button == 2) return; // right click
        
        const data = await fetch(`/api/GuessSong?id=${id}${user ? '&user='+user.id : ''}`);
        const result = data.status;
        if (result == 204) {
            setSuccess(true);
        } else if (result == 406) {
            skip();
            setSongs([]);
            if (inputRef.current) {
                inputRef.current.value = "";  
                inputRef.current.classList.add(styles.error);
                setTimeout(() => {
                    inputRef.current?.classList.remove(styles.error);
                }, 1000);
            }
        }
    }

    async function getSongs(input: string) {
        if (input.length <= 1) {
            searching.current = false;
            setSongs([]);
            return;
        }

        searching.current = true;

        const res = await fetch(`/api/GetSongs?input=${input}`);
        const songs = await res.json();
        if (songs.songData)
            setSongs(songs.songData);
    }

    return (
        <>
            <input ref={inputRef} placeholder="Search here..." name="searchInput" onChange={inputHandler} className={styles.inputBox} type="text"></input>
            
            <BindSibling hashString="heardle-guesser-dropdown">
                <DropdownBox className={styles.guessDropdown} forceOpen={searching.current}>
                    {songs?.length > 0 && songs.map((song) => (
                        <div key={song.id} className={styles.dropdownItem} onMouseUp={async (e) => await guess(e, song.id)}>
                            <span>{song.title}</span>
                            <span className={styles.artist}>{song.artist}</span>
                        </div>
                    ))}
                </DropdownBox>
            </BindSibling>
        </>
    )
}