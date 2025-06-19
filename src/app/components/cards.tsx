"use client"
import Image from "next/image";
import Link from "next/link";

import cardStyles from "@/app/styles/card.module.css";
import linkCardStyles from "@/app/styles/linkcard.module.css";
import gameCardStyles from "@/app/styles/gameCard.module.css";

function getElementGlow(element: HTMLElement) {
    const siblingID = element.getAttribute("data-sibling-id");
    const glowElement = document.querySelector(`#container-glow [data-sibling-id="${siblingID}"]`);
    return glowElement;
}

function cardMouseEnter(event: React.MouseEvent<HTMLElement>) {
    const glowElem = getElementGlow(event.currentTarget);
    console.log(glowElem);
    glowElem?.classList.add("hovered");
}

function cardMouseLeave(event: React.MouseEvent<HTMLElement>) {
    const glowElem = getElementGlow(event.currentTarget);
    glowElem?.classList.remove("hovered");
}

function hashString(str: string): string {
  // Simple hash function for demonstration
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
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
    const hashID = hashString(title + content);
    return (
        <div className={`${gameCardStyles.gameCard} ${cardStyles.card}`} data-sibling-id={hashID} onMouseEnter={cardMouseEnter} onMouseLeave={cardMouseLeave}>
            <div className={`${cardStyles.cardText}`}>
                <h3>{title}</h3>
                <p>{content}</p>
            </div>
            <div className={`${gameCardStyles.gameCardImage}`}>
                <Image width={252} height={200} alt={`Banner for ${title}`} src={imageSrc}></Image>
            </div>
        </div>
    );
}

type LinkCardProps = {
    title: string,
    description: string,
    destination: string
}

export function LinkCard({title, description, destination} : LinkCardProps){
    const hashID = hashString(title + description);
    return (
        <Link href={destination} data-sibling-id={hashID} className={`${linkCardStyles.linkCard} ${cardStyles.clickableCard} ${cardStyles.card}`} onMouseEnter={cardMouseEnter} onMouseLeave={cardMouseLeave}>
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
    );
}