import React from "react";

export function getGlowSibling(element: HTMLElement) {
    const siblingID = element.parentElement?.getAttribute("data-sibling-id");
    const glowElement = document.querySelector(`#container-glow [data-sibling-id="${siblingID}"]`);
    if (glowElement)
        return glowElement.firstChild as HTMLElement;
    else
        return null;
}

function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}


type BindSiblingProps = {
    children: React.ReactNode,
    hashString: string
}

export default function BindSibling({children, hashString} : BindSiblingProps) {
    const hashID = generateHash(hashString);
    return (
        <div data-sibling-id={hashID} >
            {children}
        </div>
    );

}