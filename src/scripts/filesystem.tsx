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

        // Scripts
        new BBFile("BRADYSBYTES.sh", this.root);
        new BBFile("asteroids.sh", scripts);
        new BBFile("skipIntro.sh", scripts);

        // Styles
        new BBFile("default.sty", styles, `{"--terminal-bg-color": "#002400","--terminal-text-color": "#63ff63","--terminal-bg-object-color": "#335b33bd","--main-font": "'Inconsolata', monospace"}`);
        new BBFile("classic.sty", styles, `{"--terminal-bg-color": "#111111","--terminal-text-color": "#ffffff","--terminal-bg-object-color": "#2a2a2abd","--main-font": "'Inconsolata', monospace"}`);
        new BBFile("jace.sty", styles, `{"--terminal-bg-color": "#420413","--terminal-text-color": "#df8cdc","--terminal-bg-object-color": "#e2ff3557","--main-font": "'Short Stack', cursive"}`);
        new BBFile("jacebright.sty", styles, `{"--terminal-bg-color": "#ffef86","--terminal-text-color": "#ffb1b1","--terminal-bg-object-color": "#ffb1b1","--main-font": "'Short Stack', cursive"}`);
        new BBFile("bright.sty", styles, `{"--terminal-bg-color": "#ffffff","--terminal-text-color": "#333333","--terminal-bg-object-color": "#878787bd","--main-font": "'Inconsolata', monospace"}`);
    
        // Games
        new BBFile("pizzaverse.gam", games, `{"Title":"Pizzaverse","Description":"Achieve your dream of running the best pizzeria this size of the Milky Way!","ImagePath":"pizzaverse.png"}`);
        new BBFile("gone_fishing.gam", games, `{"Title":"Gone Fishing","Description":"Catch fish to earn money and go deeper and deeper in this cute fishing game.","ImagePath":"gone_fishing.png"}`);
        new BBFile("sea_shawty.gam", games, `{"Title":"Sea Shawty","Description":"Help Chestnut the Pirate and Clamantha escape the haunted island with the treasure!","ImagePath":"sea_shawty.png"}`);
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

        if (nextName == undefined) 
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