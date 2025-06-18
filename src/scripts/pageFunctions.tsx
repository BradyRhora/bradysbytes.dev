import styles from '@/app/styles/terminal.module.css'
import { isMobile, wait } from '@/scripts/helpers';
import { Terminal } from '@/scripts/terminal';
import { Asteroid } from './asteroids';
import { getCookie } from '@/scripts/helpers';

export function startTerminal() {
    const terminal = new Terminal();
    const styleName = getCookie('terminal-style-file');
    if (styleName != null) {
        const styleFile = Terminal.instance.fileSystem.getFileFromPathString(styleName);
        if (styleFile != null && styleFile.content != null) terminal.changeStyle(JSON.parse(styleFile.content));
    }
}

export async function showPage(){
    let margin = 20;
    if (isMobile()) margin = 5;

    const mainContainer = document.getElementById("container");
    const glowContainer = document.getElementById("container-glow");
    if (mainContainer != null) mainContainer.style.display = "block";
    if (glowContainer != null) glowContainer.style.display = "block";

    const termContainer = document.getElementById("terminal-container");
    if (termContainer != undefined) {
        if (mainContainer != null) mainContainer.appendChild(termContainer);
        termContainer.classList.add(styles["lowered"]);
    }
    
    await wait(.75);
    if (mainContainer != null) mainContainer.style.height = `calc(100% - ${margin*2}px)`;
    if (glowContainer != null) glowContainer.style.height = `calc(100% - ${margin*2}px)`;
    
    await wait(.5);

    if (termContainer != undefined) {
        await Terminal.instance.autoCommand("./scripts/asteroids.sh", Asteroid.start);

        document.addEventListener('keypress', (e) => {
            Terminal.instance.charInput(e.key);
        });

        document.addEventListener('keydown', (e) => {
            Terminal.instance.keyDown(e.key);
        });
    }
}