//TODO: Ctrl + C => clear()?
import { BBFileSystem } from "./filesystem";
import { wait, shuffle, setCookie, getCookie, isMobile, setCSSVar } from "./helpers";
import { showPage } from "./pageFunctions";
import { Asteroid } from "@/scripts/asteroids"
import { Command } from "./terminalCommands";

export class Terminal {
    static instance = undefined;

    constructor() {        
        this.terminalElement = document.getElementById("terminal");
        this.terminalGlowElement = document.getElementById("terminal-blur");
        this.currentInput = "";

        this.fileSystem = new BBFileSystem();

        this.commandHistory = [];
        this.historyIndex = -1;
        this.skipIntro = false;

        this.forceSkipListener = this.forceSkipListener.bind(this);
        document.addEventListener('keydown', this.forceSkipListener);
        
        Terminal.instance = this;
    }

    forceSkipListener(event) {
        if (event.code == "Space" || event.code == "Enter") {
            this.skipIntro = true;
        }
    }

    clearText() {
        this.terminalElement.textContent = "";
        this.terminalGlowElement.textContent = "";
    }

    async getCommandReady(clearTerminal = true) {
        if (clearTerminal) this.clearText();
        this.currentInput = "";
        await this.print(getCommandPrefix(), 1.5);
    }

    deleteLastCharacter() {
        let newText = this.terminalElement.textContent.slice(0, this.terminalElement.textContent.length-1);
        let newGlowText = this.terminalGlowElement.textContent.slice(0, this.terminalGlowElement.textContent.length-1);
        
        this.terminalElement.textContent = newText;
        this.terminalGlowElement.textContent = newGlowText;
    }

    async print(text, time = 0) {
        this.terminalElement.textContent = this.terminalElement.textContent + text;

        this.terminalElement.scrollTop = this.terminalElement.scrollHeight;

        this.terminalGlowElement.textContent = this.terminalGlowElement.textContent + text;
        this.terminalGlowElement.scrollTop = this.terminalGlowElement.scrollHeight;
        await wait(time);
    }

    async autoType(text, time = 0) {
        return new Promise(async (resolve) => {
            for (let i = 0; i < text.length; i++){

                let newChar = text[i];
                if (newChar == '\\' && text.length > i+1 && text[i+1] == 'n') { 
                    newChar = '\n';
                    i++;
                }

                let randomWait = Math.random() / 10;
                await wait(randomWait);

                // TODO: ==>
                this.terminalElement.textContent = this.terminalElement.textContent + text[i];
                this.terminalElement.scrollTop = this.terminalElement.scrollHeight;

                this.terminalGlowElement.textContent = this.terminalGlowElement.textContent + text[i];
                this.terminalGlowElement.scrollTop = this.terminalGlowElement.scrollHeight;
            }
            await wait(time);
            resolve(); // why did i do it this way
        })
    }

    async autoCommand(command, callback = undefined) {
        if (!isMobile()) {
            await this.getCommandReady();
            await this.autoType(command, 0.5);
            this.commandHistory.unshift(command);
        }
        if (callback != undefined) callback();
    }

    changeStyle(style) {
        let keys = Object.keys(style);
        for (let s in keys) {
            setCSSVar(keys[s], style[keys[s]]);
        }
    }

    async runScript(scriptName) {
        switch(scriptName)
        {
            case "asteroids.sh":                
                let active = Asteroid.asteroidInterval != undefined;
                if (active) Asteroid.end();
                else Asteroid.start();
                this.currentInput = "";
                break;
            case "BRADYSBYTES.sh":
                return "BRADYSBYTES.DEV is already running!";
                break;
            case "skipIntro.sh":
                if (getCookie("skip-intro-toggle") == undefined) {
                    setCookie("skip-intro-toggle","");
                    return "Intro will be skipped on page load.";
                }
                else
                {
                    setCookie("skip-intro-toggle", "" , 0);
                    setCookie("skip-intros", "" , 0);
                    return "Intro will play each session.";
                }
        }
    }

    async runCommand(args) {
        if (args == undefined || args == "") {
            this.getCommandReady();
            return;
        }
        
        this.commandHistory.unshift(this.currentInput);

        let file = Terminal.instance.fileSystem.getFileFromPathString(args);
        if (file != undefined && file.name.endsWith('.sh')) {
            let output = await this.runScript(file.name);
            if (output != undefined) {
                await this.clearText();
                await this.print(output);
            }
            return;
        }

        args = args.split(' ');
        let commandName = args.shift();
        let command = Command.getCommand(commandName);
        
        this.clearText();
        if (command == undefined) await this.print("Error: Command not found!", 3);
        else if (args.length < command.func.length) await this.print(command.description);
        else {
            let output = command.func(...args);
            if (output != undefined)
                await this.print(output);
            else {
                this.getCommandReady();
            }
        }
        
        this.currentInput = "";
    }

    updateInput() {
        this.clearText();
        this.print(getCommandPrefix() + this.currentInput);
    }

    charInput(key) {
        if (key.length > 1) return;
        if (this.currentInput.length == 0) this.updateInput();

        this.currentInput += key;
        this.print(key);
    }

    keyDown(key) {
        if (key == "Backspace") {
            if (this.currentInput.length > 0) {
                this.currentInput = this.currentInput.slice(0, this.currentInput.length-1);
                this.deleteLastCharacter();
            }
        } else if (key == "Enter") {
            this.historyIndex = -1;
            this.runCommand(this.currentInput);
        } else if (key == "ArrowUp") {
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.currentInput = this.commandHistory[this.historyIndex];
                this.updateInput();
            }
        } else if (key == "ArrowDown") {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.currentInput = this.commandHistory[this.historyIndex];
                this.updateInput();
            } else if (this.historyIndex == 0) {
                this.historyIndex = -1;
                this.currentInput = "";
                this.updateInput();
            }
        }
    }
}

const CLEAR = -1;
const WAIT = 0;
const PRINT = 1;
const TYPE = 2;

// move these out of global
var user = "guest";
var fakePass = "*******";
function getCommandPrefix() { 
    let currentDir = Terminal.instance.fileSystem.currentDir.getPathString();
    currentDir = currentDir.slice(0, currentDir.length - 1);
    return `${user}@bradyserver:${currentDir}$ `; 
}

export async function showIntro() {
    let script = [//*
        {type: WAIT, time:1},
        {type: PRINT, text:"BRADY_TERM 2.0\n", time:0},
        {type: PRINT, text:"(c) All rights reserved.\n\n", time:1.5},
        {type: PRINT, text: getCommandPrefix(), time:1.5},
        {type: TYPE, text:"./BRADYSBYTES.sh\n", time:1},
        {type: PRINT, text: "Loading BRADYSBYTES.DEV", time:.5},//.5},
        {type: PRINT, text: ".", time:.6},
        {type: PRINT, text: ".", time:.7},
        {type: PRINT, text: ".\n", time:2},
        {type: CLEAR, time:0},
        {type: PRINT, text:"ENTER LOGIN\n", time:0},
        {type: PRINT, text:"USER: " , time: .6},
        {type: TYPE, text: user + "\n", time: .7},
        {type: PRINT, text:"PASS: " , time: .5},
        {type: TYPE, text: fakePass + "\n", time: (fakePass.length * .05)},
        {type: PRINT, text: "ACCESS GRANTED.", time: 2},
        {type: CLEAR, time:.5},//*/
    ]

    let jargon = ["Implementing style formatting","Upgrading service modules","Downloading processor firmware","Installing new updates","Deleting trojans","Calling mom","Adding firewall exceptions","Launching Garry's Mod","Activating Windows","Pushing to Git","Creating new user accounts","Hacking enemy mainframe","Fuzzing URLs","Downloading MineCraft modpack","Forwarding ports","Backing up critical files","Prompting AI","Initializing matrix transceiver","Stablizing black hole","Extracting tachyon crystals","Warping to Andromeda","Conceiving witty fake terminal commands","Obtaining launch codes","Searching hash tables","Pulling from database","Writing pseudocode","Imagining quantum algorithms","Rendering 3D objects","Enabling dark mode","Attaching to debugger breakpoints","Rebooting toilet server","Reloading hamster wheel cheese compartments","Reversing polarity","Artificially increasing load times","Reheating last night's dinner","Parsing source code","Connecting via dial-up","Aligning with moon phase","Scraping the internet","Gaining root access","Escalating Privileges","Coding yet another bot","Designing macros","Populating database","Cutting red wire","Summoning daemons"];

    const loopCount = 3;
    let counter = 0;
    let jargonCount = jargon.length * loopCount;
    for (let c = 1; c <= loopCount; c++) {
        shuffle(jargon);
        for (const i in jargon) {
            let line = jargon[i];
            let t = counter++ / jargonCount;
            let length = 0.5 * Math.exp(-10 * t);

            script.push({type:PRINT, text: line+"..\n", time:length});
        }
    }

    script.push({type:CLEAR,time:1});

    let terminal = Terminal.instance;

    for (const a in script) {
        if (terminal.skipIntro) break;

        let action = script[a];

        switch(action.type) {
            case PRINT:
                await terminal.print(action.text, action.time);
                break;
            case TYPE: 
                await terminal.autoType(action.text, action.time);
                break;
            case CLEAR:
                terminal.clearText();
            case WAIT:
                await wait(action.time);
        }
    }
    
    document.removeEventListener('keydown', terminal.forceSkipListener);
    setCookie("skip-intro", "", 30);
}

export async function setup() {
    //let scriptElement = document.getElementsByClassName('terminal-script')[0];
    //user = scriptElement.attr("name") // need states
    //fakePass = scriptElement.attr("fakepass");
    let terminal = new Terminal();

    if (getCookie('terminal-style-file') != undefined) {
        let styleFile = terminal.fileSystem.getFileFromPathString(getCookie('terminal-style-file'));
        terminal.changeStyle(JSON.parse(styleFile.content));
    }

    if (getCookie('skip-intro') == undefined && getCookie('skip-intro-toggle') == undefined) {
        await showIntro();
    }

    await showPage();
}
