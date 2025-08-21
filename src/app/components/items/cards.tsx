"use client"
import Image from "next/image";

import BindSibling, {getGlowSibling} from "../wrappers/siblingBinder";

import cardStyles from "@/app/styles/card.module.css";
import linkCardStyles from "@/app/styles/linkCard.module.css";
import gameCardStyles from "@/app/styles/gameCard.module.css";
import CommandLink from "./commandLink";
import ConditionalLink from "../wrappers/conditionalLink";

function cardMouseEnter(event: React.MouseEvent<HTMLElement>) {
    const glowElem = getGlowSibling(event.currentTarget);
    glowElem?.classList.add("hovered");
}

function cardMouseLeave(event: React.MouseEvent<HTMLElement>) {
    const glowElem = getGlowSibling(event.currentTarget);
    glowElem?.classList.remove("hovered");
}

type CardProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function Card({children, className = undefined, style = undefined}: CardProps) {
    let classes = `${cardStyles.contentCard} ${cardStyles.card} `;
    if (className) classes += className;
    
    return (
        <div className={classes} style={style}>
            {children}
        </div>
    );
}

type GameCardProps = {
    title: string,
    content: string,
    imageSrc: string,
    href?: string
}

export function GameCard({title, content, imageSrc, href} : GameCardProps){
    return (
        <ConditionalLink href={href}>
            <BindSibling hashString={title + content}>
                <div className={`${gameCardStyles.gameCard} ${cardStyles.card} ${href && cardStyles.clickableCard}`} onMouseEnter={cardMouseEnter} onMouseLeave={cardMouseLeave}>
                    <div className={`${cardStyles.cardText}`}>
                        <h3>{title}</h3>
                        <p>{content}</p>
                    </div>
                    {imageSrc && 
                    <div className={`${gameCardStyles.gameCardImage}`}>
                        <Image width={252} height={200} alt={`Banner for ${title}`} src={imageSrc}></Image>
                    </div>
                    }
                </div>
            </BindSibling>
        </ConditionalLink>
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
            <div 
                className={`${linkCardStyles.linkCard} ${cardStyles.clickableCard} ${cardStyles.card}`}
                onMouseEnter={cardMouseEnter}
                onMouseLeave={cardMouseLeave}
            >                
                <CommandLink href={destination}>
                    <div className={`${cardStyles.cardText}`}>
                        <h3>{title}</h3>
                        {description && <p>{description}</p>}
                    </div>
                    <div className={`${linkCardStyles.arrowContainer}`}>
                        <svg className={linkCardStyles.arrow} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/>
                        </svg>
                    </div>                    
                </CommandLink>
            </div>
        </BindSibling>
    );
}