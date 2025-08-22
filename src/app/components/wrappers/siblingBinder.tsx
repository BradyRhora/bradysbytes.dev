import React from "react";

export function getGlowSibling(element: HTMLElement) {
    const binder = element.closest(".binder");
    if (!binder) return null;
    
    const siblingID = binder.getAttribute("data-sibling-id");
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
    hashString: string,
    style?: React.CSSProperties
}

/*
 * The purpose of this component is to enable an easy method of obtaining an element's "glow sibling",
 * which is it's counterpart background component which is blurred to create a glowing effect. The reason
 * we need to be able to get this sibling is because when the main element changes it's shape/content/etc.,
 * the glow sibling has to match this change or else the elements will become visually out of sync.
 */
export default function BindSibling({children, hashString, style} : BindSiblingProps) {
    const hashID = generateHash(hashString);
    return (
        <div style={style} className="binder" data-sibling-id={hashID} >
            {children}
        </div>
    );

}