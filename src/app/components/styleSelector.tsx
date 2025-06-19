import BindSibling, {getGlowSibling} from "./siblingBinder";

import { BBFile } from "@/scripts/filesystem";

import styles from "@/app/styles/semiComponents.module.css";
import { Terminal } from "@/scripts/terminal";

function cardMouseEnter(event: React.MouseEvent<HTMLElement>) {
    const glowElem = getGlowSibling(event.currentTarget);
    glowElem?.classList.add("hovered");
    console.log(glowElem?.classList)
}

function cardMouseLeave(event: React.MouseEvent<HTMLElement>) {
    const glowElem = getGlowSibling(event.currentTarget);
    glowElem?.classList.remove("hovered");
}

function setStyle(styleFile: BBFile) {
    if (!styleFile.content) return;
    const styleJSON = JSON.parse(styleFile.content);
    Terminal.instance.changeStyle(styleJSON, styleFile.getPathString());
}

type StyleSelectorProps = {
    styleFile: BBFile
}

export default function StyleSelector({styleFile} : StyleSelectorProps) {
    let styleObj = null;
    if (styleFile.content) styleObj = JSON.parse(styleFile.content);
    else return (<></>)
    return (
        <BindSibling hashString={styleFile.name + styleFile.content}>
        <div className={styles.styleSelector} style={styleObj} onMouseEnter={cardMouseEnter} onMouseLeave={cardMouseLeave} onClick={() => setStyle(styleFile)}>
            <h4>{styleFile.name.replace(".sty","")}</h4>
        </div>
        </BindSibling>
    );
}