"use client"
import { useState, useEffect } from "react";

import { GameCard } from "../components/items/cards";
import { Terminal } from "@/scripts/terminal";

import { BBDirectory } from "@/scripts/filesystem";
import PageHeader from "../components/items/pageHeader";

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
        <PageHeader title="GAMES" parent="/"/>
        {
        games.map((game) => (
            <GameCard key={game.Title} title={game.Title} content={game.Description} imageSrc={game.ImagePath}/>
        ))
        }
        </>
    );
}