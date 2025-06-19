"use client"
import Image from "next/image";
import Link from "next/link";

import BindSibling, {getGlowSibling} from "./siblingBinder";

import cardStyles from "@/app/styles/card.module.css";
import linkCardStyles from "@/app/styles/linkcard.module.css";
import gameCardStyles from "@/app/styles/gameCard.module.css";


function cardMouseEnter(event: React.MouseEvent<HTMLElement>) {
    const glowElem = getGlowSibling(event.currentTarget);
    glowElem?.classList.add("hovered");
}

function cardMouseLeave(event: React.MouseEvent<HTMLElement>) {
    const glowElem = getGlowSibling(event.currentTarget);
    glowElem?.classList.remove("hovered");
}

export function Card({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <div className={`${cardStyles.contentCard} ${cardStyles.card}`}>
            {children}
        </div>
    );
}

type GameCardProps = {
    title: string,
    content: string,
    imageSrc: string
}

export function GameCard({title, content, imageSrc} : GameCardProps){
    return (
        <BindSibling hashString={title + content}>
            <div className={`${gameCardStyles.gameCard} ${cardStyles.card}`} onMouseEnter={cardMouseEnter} onMouseLeave={cardMouseLeave}>
                <div className={`${cardStyles.cardText}`}>
                    <h3>{title}</h3>
                    <p>{content}</p>
                </div>
                <div className={`${gameCardStyles.gameCardImage}`}>
                    <Image width={252} height={200} alt={`Banner for ${title}`} src={imageSrc}></Image>
                </div>
            </div>
        </BindSibling>
    );
}

type LinkCardProps = {
    title: string,
    description: string,
    destination: string
}

export function LinkCard({title, description, destination} : LinkCardProps){
    return (
        <BindSibling hashString={title + description}>
            <Link href={destination} className={`${linkCardStyles.linkCard} ${cardStyles.clickableCard} ${cardStyles.card}`} onMouseEnter={cardMouseEnter} onMouseLeave={cardMouseLeave}>
                <div className={`${cardStyles.cardText}`}>
                    <h3>{title}</h3>
                    {description && <p>{description}</p>}
                </div>
                <div className={`${linkCardStyles.arrowContainer}`}>
                    <svg className={linkCardStyles.arrow} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/>
                    </svg>
                </div>
            </Link>
        </BindSibling>
    );
}