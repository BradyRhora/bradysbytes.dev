export class BBFileSystem {
    root : BBDirectory;
    currentDir : BBDirectory;

    constructor() {
        this.root = new BBDirectory("");
        this.currentDir = this.root;
        this.initFiles();
    }

    initFiles() {
        // Directories
        const scripts = new BBDirectory("scripts", this.root);
        const styles = new BBDirectory("styles", this.root);
        const games = new BBDirectory("games", this.root);
        new BBDirectory("contact", this.root);

        // Scripts
        new BBFile("BRADYSBYTES.sh", this.root);
        new BBFile("asteroids.sh", scripts);
        new BBFile("skipIntro.sh", scripts);

        // Styles
        new BBFile("default.sty", styles, `{"--term-bg-color": "#002400","--term-fg-color": "#63ff63","--term-bg-obj-color": "#335b33bd","--main-font": "'Inconsolata', monospace"}`);
        new BBFile("classic.sty", styles, `{"--term-bg-color": "#111111","--term-fg-color": "#ffffff","--term-bg-obj-color": "#2a2a2abd","--main-font": "'Inconsolata', monospace"}`);
        new BBFile("bright.sty", styles, `{"--term-bg-color": "#ffffff","--term-fg-color": "#333333","--term-bg-obj-color": "#878787bd","--main-font": "'Inconsolata', monospace"}`);
        new BBFile("jace.sty", styles, `{"--term-bg-color": "#420413","--term-fg-color": "#df8cdc","--term-bg-obj-color": "#e2ff3557","--main-font": "'Short Stack', cursive"}`);
        new BBFile("jacebright.sty", styles, `{"--term-bg-color": "#ffef86","--term-fg-color": "#ffb1b1","--term-bg-obj-color": "#ffcbcb","--main-font": "'Short Stack', cursive"}`);
        
        // Games
        new BBFile("phineas_and_ferbdle.gam", games, `{"title":"Phineas and Ferbdle","description":"Guess the Phineas and Ferb song with as little context as possible!","url":"/games/paf"}`);
        new BBFile("pizzaverse.gam", games, `{"title":"Pizzaverse","description":"Achieve your dream of running the best pizzeria this side of the Milky Way.","imagePath":"/game_covers/pizzaverse.png", "url":"https://www.coolmathgames.com/0-pizzaverse"}`);
        new BBFile("gone_fishing.gam", games, `{"title":"Gone Fishing","description":"Catch fish to earn money and go deeper and deeper in this cute fishing game.","imagePath":"/game_covers/gone_fishing.png", "url":"https://matthewi.itch.io/gone-fishing"}`);
        new BBFile("sea_shawty.gam", games, `{"title":"Sea Shawty","description":"Help Chestnut the Pirate and Clamantha escape the haunted island with the Pirate's Treasure!","imagePath":"/game_covers/sea_shawty.png", "url":"https://matthewi.itch.io/sea-shawty"}`);
        new BBFile("sbps.gam", games, `{"title":"Supreme Blast Pals: Scuffle","description":"The best of the best duke it out to see who's the best of the best of the best!","url":"/games/sbps"}`);
    }

    getFileFromPathString(path: string) {
        const pathArray = path.split('/');
        if (path.startsWith('/')) return this.root.seekFile(pathArray.slice(1));
        else return this.currentDir.seekFile(pathArray);
    }
}

export class BBFile {
    name: string;
    content: string | null;
    parent!: BBDirectory | null;

    constructor(name: string, parent: BBDirectory | null, content: string | null = null) {
        this.name = name;
        this.content = content;
        
        if (parent != null) this.setParent(parent);
        else parent = null;
    }

    setParent(directory: BBDirectory) {
        this.parent = directory;
        this.parent.addChild(this);
    }
    
    getPathString(): string {
        if (!this.parent) return this.getPrintName();
        return this.parent.getPathString() + this.getPrintName();
    }

    getPrintName() { return this.name; }

    isDirectory() { return this instanceof BBDirectory; }
}

export class BBDirectory extends BBFile {
    children: BBFile[];
    parent!: BBDirectory | null;

    constructor(name: string, parent: BBDirectory | null = null) {
        super(name, null);
        if (parent != null) this.setParent(parent);
        this.children = [];
    }

    addChild(child: BBFile) {
        this.children.push(child);
    }

    getAllFiles(includeDirectories = false) {
        let files = this.children;
        if (!includeDirectories) files = files.filter(f => !(f instanceof BBDirectory));
        return files;
    }

    getFile(name: string) {
        if (name == '.') return this;
        if (name == '..') return this.parent;

        for (const f in this.children) {
            if (this.children[f].name == name) {
                return this.children[f];
            }
        }
    }

    // Recursively navigates to locate file
    seekFile(pathArray: string[]): BBFile | null {
        const nextName = pathArray.shift();

        if (nextName == undefined || nextName == "") 
            return this;

        const next = this.getFile(nextName);

        // File not found
        if (next == undefined) return null;

        if (pathArray.length == 0) 
            return next;
        else if (next instanceof BBDirectory)
            return next.seekFile(pathArray);
        else // invalid path syntax
            return null;
    }

    getPrintName() {
        return this.name + "/";
    }
}