"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom";
import { Prisma } from "../../../../generated/prisma"

import style from './sbps.module.css'
import BindSibling, { getGlowSibling } from "@/app/components/wrappers/siblingBinder";

type PlayerWithCharacters = Prisma.SBPSPlayerGetPayload<{include: {main: true, secondary: true}}>;

export default function Player({id, tag} : {id: string, tag?:string}) {
    const playerRef = useRef<HTMLSpanElement>(null);
    const [playerTag, setPlayerTag] = useState<string|undefined>(tag);
    const [playerData, setPlayerData] = useState<PlayerWithCharacters | undefined>();

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalPos, setModalPos] = useState<{x: number, y: number}>({x: 0, y: 0})

    const fetchPlayerData = useCallback(async () => {
        fetch('/api/SBPS/Player?id='+id)
            .then(resp => resp.json())
            .then((player) => {
                setPlayerTag(player.tag);
                setPlayerData(player);
            });
    }, [id]);

    async function handleModalOpen() {
        if (!playerData) await fetchPlayerData();
        const x = playerRef.current?.getBoundingClientRect().x || 0;
        const y = playerRef.current?.getBoundingClientRect().bottom || 0;
        setModalPos({x: x, y: y});
        setModalOpen(true);

        if (playerRef.current)
            getGlowSibling(playerRef.current)?.classList.add(style.playerHovered);
    }

    function handleModalClose() {
        setModalOpen(false);

        if (playerRef.current)
            getGlowSibling(playerRef.current)?.classList.remove(style.playerHovered);
    }

    useEffect(() => {
        if (!tag) {
           fetchPlayerData();
        } else {
            setPlayerTag(tag);
        }
    }, [fetchPlayerData, tag]);

    const modal = modalOpen ? createPortal(
        <div className={style.playerInfoModal} style={{left: modalPos.x, top: modalPos.y}}>
            {playerData ? 
            <>
            <div style={{backgroundColor:playerData.main.colour}}>Main: {playerData.main.name}</div>
            {playerData.secondary && <div style={{backgroundColor:playerData.secondary.colour}}>Secondary: {playerData.secondary.name}</div>}
            </>
            : "Loading..."}
        </div>
    , document.body)
    : null;

    return (
        <BindSibling style={{display:"inline-block"}} hashString={playerTag+"-bracket"}>
            <span ref={playerRef} className={`${style.player} ${modalOpen ? style.playerHovered : ''}`} onMouseOver={handleModalOpen} onMouseLeave={handleModalClose}>
                {playerTag}
            </span>
            {modal}
        </BindSibling>
    )
}