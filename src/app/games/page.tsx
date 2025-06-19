"use client"
import { useState, useEffect } from "react";
import Link from "next/link";

import { GameCard } from "../components/items/cards";
import { Terminal } from "@/scripts/terminal";

import styles from "../styles/main.module.css"
import { BBDirectory } from "@/scripts/filesystem";

type Game = {
    Title: string,
    Description: string,
    ImagePath: string
}

export default function TestPage() {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const gamesDir = Terminal.instance.fileSystem.getFileFromPathString("/games") as BBDirectory;
        const gameFiles = gamesDir.getAllFiles();
        const gameData = gameFiles.map(g => {
            if (g.content != null) return JSON.parse(g.content);
            else return null;
        });
        setGames(gameData);
    }, []);

    return (
        <>
        <Link className={styles.goBack} href="/">..</Link>
        <h1 className={styles.header}>/GAMES</h1>
        {
        games.map((game) => (
            <GameCard key={game.Title} title={game.Title} content={game.Description} imageSrc={"/game_covers/"+game.ImagePath}/>
        ))
        }
        </>
    );
}