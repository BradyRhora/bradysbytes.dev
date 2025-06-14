import styles from '@/app/terminal.module.css'
import { isMobile, wait } from '@/scripts/helpers.js';
import { Terminal } from '@/scripts/terminal.js';
import { Asteroid } from './asteroids';

export function initGlow() {
    const container = document.getElementById("container");
    if (!container) return;

    // Clone the container node (deep clone)
    const glow = container.cloneNode(true);
    glow.id = "container-glow";
    glow.classList.add(styles["glow"]);

    // Append the glow element to the same parent
    container.parentNode.appendChild(glow);
}

export async function showPage(){
    let margin = 20;
    if (isMobile()) margin = 5;

    let mainContainer = document.getElementById("container");
    let glowContainer = document.getElementById("container-glow");
    mainContainer.style.display = "block";
    glowContainer.style.display = "block";

    let termContainer = document.getElementById("terminal-container");
    mainContainer.appendChild(termContainer);
    termContainer.classList.add(styles["lowered"]);
    
    await wait(.75);
    mainContainer.style.height = `calc(100% - ${margin*2}px)`;
    glowContainer.style.height = `calc(100% - ${margin*2}px)`;
    
    await wait(.5);
    await Terminal.instance.autoCommand("./scripts/asteroids.sh", Asteroid.start);

    document.addEventListener('keypress', (e) => {
        Terminal.instance.charInput(e.key);
    });

    document.addEventListener('keydown', (e) => {
        Terminal.instance.keyDown(e.key);
    });    
}