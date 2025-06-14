import styles from '@/app/terminal.module.css';

var asteroidCount = 10;
const MOUSE_DETECTION_RANGE = 100;
const STROKE_SIZE = 5; // must be set to match style.css svg stroke
const MIN_SIZE = 32;
const MAX_SIZE = 86;

// TODO: click & drag asteroids around?

export class Asteroid {
    static asteroids = [];
    static container = undefined;
    static mousePos = [-1000,-1000];
    static asteroidInterval = undefined;

    constructor(x, y) {
        this.size = Math.random() * (MAX_SIZE-MIN_SIZE) + MIN_SIZE;        
        this.speed = [Math.random() * 4 + 1 - (this.size * .0025), Math.random() * 4 + 1 - (this.size * .0025)];
       
        if (x == undefined || y == undefined) {
            let side = Math.trunc(Math.random() * 4);

            switch(side) {
                case 0:
                    this.y = -this.size;
                    this.x = Math.random() * Asteroid.container.clientWidth;
                    this.speed = [Math.random() - 0.5, Math.random() * 0.5];
                    break;
                case 1:
                    this.x = Asteroid.container.clientWidth;;
                    this.y = Math.random() * Asteroid.container.clientHeight;
                    this.speed = [Math.random() * -0.5, Math.random() - 0.5];
                    break;
                case 2:
                    this.y = Asteroid.container.clientHeight;
                    this.x = Math.random() * Asteroid.container.clientWidth;
                    this.speed = [Math.random() - 0.5, Math.random() * -0.5];
                    break;
                case 3:
                    this.x = -this.size;
                    this.y = Math.random() * Asteroid.container.clientHeight;
                    this.speed = [Math.random() * 0.5, Math.random() - 0.5];
                    break;
            }
        } else {
            this.x = x;
            this.y = y;
        }


        this.div = document.createElement("div");
        this.div.className = styles["asteroid"];
        let pathData = noisyCirclePath(0, 0, this.size - STROKE_SIZE, 16, 0.15);
        this.div.innerHTML = `<svg height="${this.size}" width="${this.size}" viewBox="${-this.size} ${-this.size} ${this.size*2} ${this.size*2}" xmlns="http://www.w3.org/2000/svg">
            <path d="${pathData}" fill="none" stroke="var(--terminal-bg-object-color)" stroke-width="${STROKE_SIZE}" />
        </svg>`;
        //this.div.style.filter = `blur(${Math.random() * 2 + 2}px)`;
        this.div.style.filter = `blur(2px)`;

        Asteroid.container.append(this.div);
        Asteroid.asteroids.push(this);
        this.update();
    }

    collide(other) {
        let meCenter = [this.x + this.size / 2, this.y + this.size / 2];
        let otherCenter = [other.x + other.size / 2, other.y + other.size / 2];
        let directionVector = [otherCenter[0] - meCenter[0], otherCenter[1] - meCenter[1]];
        let dist = Math.sqrt(directionVector[0] ** 2 + directionVector[1] ** 2);
        if (dist === 0) return; // Prevent division by zero

        let normal = [directionVector[0] / dist, directionVector[1] / dist];
        let tangent = [-normal[1], normal[0]];

        let v1n = this.speed[0] * normal[0] + this.speed[1] * normal[1];
        let v1t = this.speed[0] * tangent[0] + this.speed[1] * tangent[1];
        let v2n = other.speed[0] * normal[0] + other.speed[1] * normal[1];
        let v2t = other.speed[0] * tangent[0] + other.speed[1] * tangent[1];

        let v1nAfter = v2n;
        let v2nAfter = v1n;

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
        for (let a in Asteroid.asteroids) {
            let other = Asteroid.asteroids[a];
            if (other == this) continue; // skip self

            let thisCenter = [this.x + this.size / 2, this.y + this.size / 2];
            let youCenter = [other.x + other.size / 2, other.y + other.size / 2];

            let distVec = [thisCenter[0] - youCenter[0], thisCenter[1] - youCenter[1]];
            let dist = Math.sqrt((distVec[0] ** 2) + (distVec[1] ** 2));
            let minDist = (this.size / 2) + (other.size / 2);

            if (dist < minDist && dist > 0) {
                this.collide(other);

                let overlap = minDist - dist;                
                let nx = distVec[0] / dist;
                let ny = distVec[1] / dist;

                this.x += nx * (overlap / 2);
                this.y += ny * (overlap / 2);
                other.x -= nx * (overlap / 2);
                other.y -= ny * (overlap / 2);
            }
        }
    }

    update() {
        this.checkCollision();

        // Mouse detection
        let mouseDistVec = [this.x+this.size/2 - Asteroid.mousePos[0], this.y+this.size/2 - Asteroid.mousePos[1]];
        let mouseDist = Math.sqrt((mouseDistVec[0] ** 2) + (mouseDistVec[1] ** 2));

        if (mouseDist <= MOUSE_DETECTION_RANGE) 
        {
            let normDistVec = [mouseDistVec[0] / mouseDist, mouseDistVec[1] / mouseDist];
            let strength = ((MOUSE_DETECTION_RANGE - mouseDist) / MOUSE_DETECTION_RANGE) * 0.2;

            let xMod = normDistVec[0] * strength;
            let yMod = normDistVec[1] * strength;

            this.speed = [this.speed[0] + xMod, this.speed[1] + yMod];
        }


        // Move position
        this.x += this.speed[0];
        this.y += this.speed[1];

        this.div.style.left = this.x + "px"
        this.div.style.top = this.y + "px"

        // Out of bounds check
        if (this.x < 0 - (this.size * 2)
         || this.x > Asteroid.container.clientWidth
         || this.y < 0 - (this.size * 2)
         || this.y > Asteroid.container.clientHeight) 
        {
            this.div.remove();
            return false; // Tells outer function to remove from asteroid array
        }

        return true;
    }

    static updateAll() {
        for (let i = Asteroid.asteroids.length - 1; i >= 0; i--) {
            if (!this.asteroids[i].update()) {
                Asteroid.asteroids.splice(i,1);
                new Asteroid();
            }
        }
    }

    static updateMousePosition(x, y) {
        Asteroid.mousePos = [x, y];
    }

    static async start() {
        let div = document.createElement("div");
        div.id = "asteroids";
        div.className = `${styles["background"]} ${styles["asteroids"]}`;
        Asteroid.container = div;

        document.getElementById("container").append(Asteroid.container);

        setDynamicAsteroidCount();
        for (let i = 0; i < asteroidCount; i++) {
            new Asteroid();
        }
        
        Asteroid.asteroidInterval = setInterval(() => {
            Asteroid.updateAll();
        }, 30);
    }

    static end() {
        Asteroid.container.remove();
        Asteroid.asteroids = [];
        clearInterval(Asteroid.asteroidInterval);
        Asteroid.asteroidInterval = undefined;
    }
}

function noisyCirclePath(cx, cy, r, points = 32, noise = 0.15) {
    let d = "";
    for (let i = 0; i < points; i++) {
        let angle = (i / points) * 2 * Math.PI;
        let rand = 1 + (Math.random() - 0.5) * noise; // noise factor
        let x = cx + Math.cos(angle) * r * rand;
        let y = cy + Math.sin(angle) * r * rand;
        d += (i === 0 ? "M" : "L") + x + " " + y + " ";
    }
    d += "Z";
    return d;
}

function setDynamicAsteroidCount() {
    let windowArea = window.innerWidth * window.innerHeight;
    let avgAsteroidArea = ((MAX_SIZE + MIN_SIZE) / 2) ** 2;

    asteroidCount = (windowArea / avgAsteroidArea) / 10;
    //debug
    //asteroidCount = 2;
}

export function hookAsteroidEvents() {
    document.addEventListener('mousemove', function (event) {
            Asteroid.updateMousePosition(event.pageX,event.pageY);
        })
    
    document.addEventListener('mouseleave', function () {
        Asteroid.updateMousePosition(-1000, -1000);
    })
}