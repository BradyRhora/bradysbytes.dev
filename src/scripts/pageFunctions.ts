import mainStyles from '@/app/styles/main.module.css';
import terminalStyles from '@/app/styles/terminal.module.css'

import { wait } from '@/scripts/helpers';
import { Terminal } from '@/scripts/terminal';
import { getCookie } from '@/scripts/helpers';

export function startTerminal() {
    const terminal = new Terminal();

    // Set users chosen style based on cookie
    const styleName = getCookie('terminal-style-file');
    if (styleName != null) {
        const styleFile = Terminal.instance.fileSystem.getFileFromPathString(styleName);
        if (styleFile != null && styleFile.content != null) terminal.changeStyle(JSON.parse(styleFile.content));
    }
}

export async function showPage(){
    // Get Containers
    const mainContainer = document.getElementById("container");
    const glowContainer = document.getElementById("container-glow");
    if (mainContainer != null) mainContainer.style.display = "block";
    if (glowContainer != null) glowContainer.style.display = "block";

    // Move intro terminal into Container
    const termContainer = document.getElementById("terminal-container");
    if (termContainer != undefined) {
        //if (mainContainer != null) mainContainer.appendChild(termContainer);
        termContainer.classList.add(terminalStyles["lowered"]);
    }
    await wait(.75);

    // Open Main Containers & Bind scroll events
    if (glowContainer != null) glowContainer.classList.add(mainStyles["container-open"]);
    if (mainContainer != null) {
        mainContainer.classList.add(mainStyles["container-open"]);
        mainContainer.addEventListener('scroll', () => {
            const scrollAmount = mainContainer.scrollTop;
            if (glowContainer != null) glowContainer.scrollTop = scrollAmount;
        });
    }
    await wait(.5);

    // Start default background script and key input listeners
    if (termContainer != undefined) {
        await Terminal.instance.autoCommand("./scripts/asteroids.sh");

        document.addEventListener('keypress', (e) => {
            const active = document.activeElement;
            if (active) {
                switch(active.tagName) {
                    case "INPUT":
                    case "TEXTAREA":
                        return;
                }
            }

            Terminal.instance.charInput(e.key);
        });

        document.addEventListener('keydown', (e) => {
            const active = document.activeElement;
            if (active) {
                switch(active.tagName) {
                    case "INPUT":
                    case "TEXTAREA":
                        return;
                }
            }

            Terminal.instance.keyDown(e.key);
        });
    }
}