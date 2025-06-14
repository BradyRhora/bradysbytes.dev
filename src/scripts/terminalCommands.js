import { Terminal } from "./terminal.js";
import { setCookie } from "./helpers.js";

export class Command
{
    static commands = [];

    constructor(name, desc, func){
        this.name = name;
        this.description = desc;
        this.func = func;
        Command.commands.push(this);
        return this;
    }

    getRequiredArgCount()
    {
        return this.func.length;
    }

    static getCommand(name)
    {
        for (let c in Command.commands)
        {
            if (Command.commands[c].name.toLowerCase() == name.toLowerCase()) return Command.commands[c];
        }

        return undefined;
    }
}

new Command("cd", "Usage: `cd [directory]` - Move to specified directory.", (newDir) =>
{
    if (newDir == "..")
    {
        if (Terminal.instance.fileSystem.currentDir.parent != undefined)
        {
            Terminal.instance.fileSystem.currentDir = Terminal.instance.fileSystem.currentDir.parent;
            return undefined;
        }
    }
    else
    {
        let file = Terminal.instance.fileSystem.currentDir.getFile(newDir);
        if (file.isDirectory())
        {
            Terminal.instance.fileSystem.currentDir = file;
            return undefined;
        }
        else
        {
            return `'${newDir}' is not a directory.`;
        }
    }
    
    return `Directory '${newDir}' not found.`;
});

new Command("ls", "Usage: `ls (directory)` - Shows files in given directory, or current if no arguments.", (directoryName = undefined) =>
{
    let dir = Terminal.instance.fileSystem.currentDir;
    if (directoryName != undefined) dir = Terminal.instance.fileSystem.getFileFromPathString(directoryName);

    let files = ". ";
    if (dir.parent != undefined) files += ".. ";

    for(let f in dir.children)
    {
        let file = dir.children[f];
        files += file.getPrintName() + " ";
    }

    return files;
});

new Command("pwd", "Prints the current working directory.", () =>
{
    return Terminal.instance.fileSystem.currentDir.getPathString();
});

new Command("cat", "Usage: `cat [file]` - Prints file contents.", (fileName) =>
{
    let file = Terminal.instance.fileSystem.getFileFromPathString(fileName);
    if (file == undefined) return `File '${fileName}' not found.`;

    if (file.content == undefined) return "You do not have permission to read this file!";
    return file.content;
});

new Command("style", "Usage: `style [styleFile]` - Sets terminal style based on style file (.sty)", (styleFileName) =>
{
    let styleFile = Terminal.instance.fileSystem.getFileFromPathString(styleFileName);

    if (styleFile == undefined) styleFile = Terminal.instance.fileSystem.getFileFromPathString(styleFileName + ".sty");
    if (styleFile == undefined) return `Style file '${styleFileName}' not found.`;
        
    let styleName = styleFile.name.replace(".sty", "");
    let style = JSON.parse(styleFile.content);
    if (style == undefined) return `Invalid style file '${styleFileName}'.`;

    Terminal.instance.changeStyle(style);
    
    setCookie("terminal-style-file", styleFile.getPathString());
    return `${styleName} style activated.`;
});

new Command("help", "Usage: `help (command)` - Get command information.", (command = undefined) =>
{
    let sortedCommands = Command.commands.sort((a, b) => a.name.localeCompare(b.name));

    let commands = "Available commands: ";
    for (let c in sortedCommands)
    {
        commands += Command.commands[c].name;

        if (command != undefined && Command.commands[c].name == command) return Command.commands[c].description;

        if (c < Command.commands.length - 1) commands += ",";
        commands += " ";
    }
    
    return commands;
});