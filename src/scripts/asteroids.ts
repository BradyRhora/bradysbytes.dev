import styles from '@/app/styles/asteroid.module.css';
import { throwIfSyncIOUsed } from 'next/dist/server/app-render/dynamic-rendering';

let asteroidCount = 10;
const MOUSE_DETECTION_RANGE = 100;
const STROKE_SIZE = 5; // must be set to match aseroid.module.css svg stroke
const MIN_SIZE = 32;
const MAX_SIZE = 86;

// TODO: click & drag asteroids around?

export class SpaceObject {
    static container : HTMLElement | null = null;
    static scrollContainer : HTMLElement;
    static mousePos: [number, number] = [-1000,-1000];
    static updateInterval: ReturnType<typeof setInterval> | null = null;

    size! : number;
    speed! : [number, number];
    x!: number;
    y!: number;
    div!: HTMLElement;

    constructor(x: number | null = null, y: number | null = null) {
        this.size = Math.random() * (MAX_SIZE-MIN_SIZE) + MIN_SIZE;        
        this.speed = [Math.random() * 4 + 1 - (this.size * .0025), Math.random() * 4 + 1 - (this.size * .0025)];
       
        if (x == null || y == null) {
            this.randomSpawn();
        } else {
            this.x = x;
            this.y = y;
        }


        this.div = document.createElement("div");
        this.div.className = styles["asteroid"];
        const pathData = noisyCirclePath(0, 0, this.size - STROKE_SIZE, 16, 0.15);
        this.div.innerHTML = `<svg height="${this.size}" width="${this.size}" viewBox="${-this.size} ${-this.size} ${this.size*2} ${this.size*2}" xmlns="http://www.w3.org/2000/svg">
            <path d="${pathData}" fill="none" stroke="var(--term-bg-obj-color)" stroke-width="${STROKE_SIZE}" />
        </svg>`;

        
        if (SpaceObject.container != null) SpaceObject.container.append(this.div);

        const sContainer = document.getElementById("container");
        if (SpaceObject.scrollContainer == null && sContainer) SpaceObject.scrollContainer = sContainer;

        Asteroid.asteroids.push(this);
        this.update();
    }

    static async start() {
        const div = document.createElement("div");
        div.id = "asteroids";
        div.className = `${styles["asteroids"]}`;
        this.container = div;

        document.getElementById("container-glow")?.append(this.container);

        Asteroid.init();
        
        this.updateInterval = setInterval(() => {
            Asteroid.updateAll();
        }, 30);
    }

    static end() {
        Asteroid.cleanup();

        this.container?.remove();
        if (this.updateInterval != null) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    static updateMousePosition(x: number, y: number) {
        if (!this.container) return;

        const scrollOffset = this.scrollContainer.scrollTop;
        this.mousePos = [x, y + scrollOffset];
    }

    static startShip() {
        // Hide main website UI
        const container = document.getElementById("something");
        if (container) container.style.display = "None";

        // Create Ship object
    }

    randomSpawn() {
        if (SpaceObject.container == null) return; 

        const side = Math.trunc(Math.random() * 4);
        switch(side) {
            case 0:
                this.y = -this.size;
                this.x = Math.random() * SpaceObject.container.clientWidth;
                this.speed = [Math.random() - 0.5, Math.random() * 0.5];
                break;
            case 1:
                this.x = SpaceObject.container.clientWidth;
                this.y = Math.random() * SpaceObject.container.clientHeight;
                this.speed = [Math.random() * -0.5, Math.random() - 0.5];
                break;
            case 2:
                this.y = SpaceObject.container.clientHeight;
                this.x = Math.random() * SpaceObject.container.clientWidth;
                this.speed = [Math.random() - 0.5, Math.random() * -0.5];
                break;
            case 3:
                this.x = -this.size;
                this.y = Math.random() * SpaceObject.container.clientHeight;
                this.speed = [Math.random() * 0.5, Math.random() - 0.5];
                break;
        }
    }

    collide(other: SpaceObject) {
        const meCenter = [this.x + this.size / 2, this.y + this.size / 2];
        const otherCenter = [other.x + other.size / 2, other.y + other.size / 2];
        const directionVector = [otherCenter[0] - meCenter[0], otherCenter[1] - meCenter[1]];
        const dist = Math.sqrt(directionVector[0] ** 2 + directionVector[1] ** 2);
        if (dist === 0) return; // Prevent division by zero

        const normal = [directionVector[0] / dist, directionVector[1] / dist];
        const tangent = [-normal[1], normal[0]];

        const v1n = this.speed[0] * normal[0] + this.speed[1] * normal[1];
        const v1t = this.speed[0] * tangent[0] + this.speed[1] * tangent[1];
        const v2n = other.speed[0] * normal[0] + other.speed[1] * normal[1];
        const v2t = other.speed[0] * tangent[0] + other.speed[1] * tangent[1];

        const v1nAfter = v2n;
        const v2nAfter = v1n;

        this.speed = [
            v1nAfter * normal[0] + v1t * tangent[0],
            v1nAfter * normal[1] + v1t * tangent[1]
        ];
        other.speed = [
            v2nAfter * normal[0] + v2t * tangent[0],
            v2nAfter * normal[1] + v2t * tangent[1]
        ];
    }

    checkCollision() {
        for (const a in Asteroid.asteroids) {
            const other = Asteroid.asteroids[a];
            if (other == this) continue; // skip self

            const thisCenter = [this.x + this.size / 2, this.y + this.size / 2];
            const youCenter = [other.x + other.size / 2, other.y + other.size / 2];

            const distVec = [thisCenter[0] - youCenter[0], thisCenter[1] - youCenter[1]];
            const dist = Math.sqrt((distVec[0] ** 2) + (distVec[1] ** 2));
            const minDist = (this.size / 2) + (other.size / 2);

            if (dist < minDist && dist > 0) {
                this.collide(other);

                const overlap = minDist - dist;                
                const nx = distVec[0] / dist;
                const ny = distVec[1] / dist;

                this.x += nx * (overlap / 2);
                this.y += ny * (overlap / 2);
                other.x -= nx * (overlap / 2);
                other.y -= ny * (overlap / 2);
            }
        }
    }

    update() {
        if (!SpaceObject.container) return false; // If container doesn't exist, don't update
        this.checkCollision();

        


        // Move position
        this.x += this.speed[0];
        this.y += this.speed[1];

        this.div.style.left = this.x + "px"
        this.div.style.top = this.y + "px"

        // Out of bounds check
        if (this.x < 0 - (this.size * 2)
         || this.x > SpaceObject.container.clientWidth
         || this.y < 0 - (this.size * 2)
         || this.y > SpaceObject.scrollContainer.scrollHeight) 
        {
            this.div.remove();
            return false; // Tells outer function to remove from asteroid array
        }

        return true;
    }
}

export class Asteroid extends SpaceObject {
    static asteroids : Asteroid[] = [];

    static init() {        
        setDynamicAsteroidCount();
        for (let i = 0; i < asteroidCount; i++) {
            new Asteroid();
        }
    }

    static updateAll() {
        for (let i = Asteroid.asteroids.length - 1; i >= 0; i--) {
            if (!Asteroid.asteroids[i].update()) {
                Asteroid.asteroids.splice(i,1);
                new Asteroid();
            }
        }
    }

    static cleanup() {
        Asteroid.asteroids = [];
    }

    update() {
        // Mouse detection
        const mouseDistVec = [this.x+this.size/2 - Asteroid.mousePos[0], this.y+this.size/2 - Asteroid.mousePos[1]];
        const mouseDist = Math.sqrt((mouseDistVec[0] ** 2) + (mouseDistVec[1] ** 2));

        if (mouseDist <= MOUSE_DETECTION_RANGE) 
        {
            const normDistVec = [mouseDistVec[0] / mouseDist, mouseDistVec[1] / mouseDist];
            const strength = ((MOUSE_DETECTION_RANGE - mouseDist) / MOUSE_DETECTION_RANGE) * 0.2;

            const xMod = normDistVec[0] * strength;
            const yMod = normDistVec[1] * strength;

            this.speed = [this.speed[0] + xMod, this.speed[1] + yMod];
        }

        return super.update();        
    }
}

export class Spaceship extends SpaceObject {

}

function noisyCirclePath(cx: number, cy: number, r: number, points = 32, noise = 0.15) {
    let d = "";
    for (let i = 0; i < points; i++) {
        const angle = (i / points) * 2 * Math.PI;
        const rand = 1 + (Math.random() - 0.5) * noise; // noise factor
        const x = cx + Math.cos(angle) * r * rand;
        const y = cy + Math.sin(angle) * r * rand;
        d += (i === 0 ? "M" : "L") + x + " " + y + " ";
    }
    d += "Z";
    return d;
}

function setDynamicAsteroidCount() {
    const windowArea = window.innerWidth * window.innerHeight;
    const avgAsteroidArea = ((MAX_SIZE + MIN_SIZE) / 2) ** 2;

    asteroidCount = Math.floor((windowArea / avgAsteroidArea) / 10);
}

export function hookAsteroidEvents() {
    document.addEventListener('mousemove', function (event) {
            Asteroid.updateMousePosition(event.pageX,event.pageY);
        })
    
    document.addEventListener('mouseleave', function () {
        Asteroid.updateMousePosition(-1000, -1000);
    })
}