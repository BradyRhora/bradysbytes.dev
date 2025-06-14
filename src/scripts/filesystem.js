export class BBFileSystem {
    constructor() {
        this.root = new BBDirectory("", undefined);
        this.currentDir = this.root;
        this.initFiles();
    }

    initFiles() {
        // Directories
        let scripts = new BBDirectory("scripts", this.root);
        let styles = new BBDirectory("styles", this.root);

        // Files
        new BBFile("BRADYSBYTES.sh", this.root);
        new BBFile("asteroids.sh", scripts);
        new BBFile("skipIntro.sh", scripts);

        new BBFile("default.sty", styles, `{"terminal-bg-color": "#002400","terminal-text-color": "#63ff63","terminal-bg-object-color": "#335b33bd"}`);
        new BBFile("jace.sty", styles, `{"terminal-bg-color": "#420413","terminal-text-color": "#df8cdc","terminal-bg-object-color": "#e2ff3557"}`);
        new BBFile("classic.sty", styles, `{"terminal-bg-color": "#111111","terminal-text-color": "#ffffff","terminal-bg-object-color": "#2a2a2abd"}`);
        new BBFile("bright.sty", styles, `{"terminal-bg-color": "#ffffff","terminal-text-color": "#333333","terminal-bg-object-color": "#878787bd"}`);
    }

    getFileFromPathString(path) {
        let pathArray = path.split('/');
        if (path.startsWith('/')) return this.root.seekFile(pathArray.slice(1));
        else return this.currentDir.seekFile(pathArray);
    }
}

class BBFile {
    constructor(name, parent, content) {
        this.name = name;
        this.content = content;
        this.setParent(parent);
    }

    setParent(directory) {
        if (directory == undefined) return; // root

        if (!(directory instanceof BBDirectory)) {
            throw new Error("Parent must be of type BBDirectory. Argument is:", typeof(directory));
        }

        this.parent = directory;
        this.parent.addChild(this);
    }
    
    getPathString() {
        if (!this.parent) return this.getPrintName();
        return this.parent.getPathString() + this.getPrintName();
    }

    getPrintName() { return this.name; }

    isDirectory() { return this instanceof BBDirectory; }
}

class BBDirectory extends BBFile {
    constructor(name, parent) {
        super(name, parent);
        this.children = [];
    }

    addChild(child) {
        if (!(child instanceof BBFile)) {
            throw new Error("Child must be of type BBFile. Argument is:", typeof(child));
        }

        this.children.push(child);
    }

    getFile(name) {
        if (name == '.') return this;
        if (name == '..') return this.parent;

        for (let f in this.children) {
            if (this.children[f].name == name) {
                return this.children[f];
            }
        }
    }

    // Recursively navigates to locate file
    seekFile(pathArray) {
        let nextName = pathArray.shift();
        let next = this.getFile(nextName);

        if (next == undefined) return undefined;

        if (pathArray.length == 0)
            return next;
        else
            return next.seekFile(pathArray);
    }

    getPrintName() {
        return this.name + "/";
    }
}