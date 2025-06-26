import React, { useState, useRef, useContext } from "react";

import DropdownBox from "../wrappers/dropdownBox";
import { PafSkipContext } from "@/app/components/wrappers/contextProviderWrapper";
import BindSibling, { getGlowSibling } from "../wrappers/siblingBinder";

import styles from "@/app/styles/paf.module.css"
import dropdownStyles from "@/app/styles/semiComponents.module.css"

export default function HeardleGuesser() {
    type basicSongInfo = {
        title: string,
        artist: string
    }

    const [skips, setSkips] = useContext(PafSkipContext);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [songs, setSongs] = useState<basicSongInfo[]>([]);
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
        }, 100);
    }

    async function guess(title: string) {
        const data = await fetch(`/api/GuessSong?guess=${title}`);
        const result = data.status;
        if (result == 204) {
            alert("GOTTEM!");
            setSkips(6); // TODO: add message showing score and whatnot
        } else if (result == 406) {
            alert("NOPE!");
            setSkips(skips+1);
        }
    }

    async function getSongs(input: string) {
        if (input.length <= 0) {
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
            <input placeholder="Search here..." name="searchInput" onChange={inputHandler} className={styles.inputBox} type="text"></input>
            
            <BindSibling hashString="heardle-guesser-dropdown">
                <DropdownBox className={styles.guessDropdown} forceOpen={searching.current}>
                    {songs?.length > 0 && songs.map((song, index) => (
                        <div key={index} className={styles.dropdownItem} onMouseUp={async () => await guess(song.title)}>
                            <span>{song.title}</span>
                            <span className={styles.artist}>{song.artist}</span>
                        </div>
                    ))}
                </DropdownBox>
            </BindSibling>
        </>
    )
}