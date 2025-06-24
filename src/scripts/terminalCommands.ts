import { Terminal } from "./terminal";
import { BBDirectory } from "./filesystem";
export class Command
{
    static commands: Command[] = [];
    name: string;
    description: string;
    func: (...args: string[]) => string | undefined;

    constructor(name: string, desc: string, func: (...args: string[]) => string | undefined){
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

    static getCommand(name: string)
    {
        for (const c in Command.commands)
        {
            if (Command.commands[c].name.toLowerCase() == name.toLowerCase()) return Command.commands[c];
        }

        return undefined;
    }
}

new Command("cd", "Usage: `cd [directory]` - Move to specified directory.", (newDir: string) =>
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
        const file = Terminal.instance.fileSystem.getFileFromPathString(newDir);
        if (file == null) return `'${newDir} not found.`;
        
        if (file instanceof BBDirectory)
        {
            Terminal.instance.fileSystem.currentDir = file;
            // switch page based on current directory (currently will cause infinite loop: cd dir -> change page -> auto cd command -> change page... etc)
            // document.location = file.name;
            return undefined;
        }
        else return `'${newDir}' is not a directory.`;
    }
    
    return `Directory '${newDir}' not found.`;
});

new Command("ls", "Usage: `ls (directory)` - Shows files in given directory, or current if no arguments.", (directoryName: string | null = null) =>
{
    let dir = Terminal.instance.fileSystem.currentDir;
    if (directoryName != undefined) {
        const dirArg = Terminal.instance.fileSystem.getFileFromPathString(directoryName);
        if (dirArg instanceof BBDirectory) dir = dirArg;
        else return `'${directoryName}' is not a directory.`;
    }

    let files = ". ";
    if (dir.parent != undefined) files += ".. ";

    for(const f in dir.children)
    {
        const file = dir.children[f];
        files += file.getPrintName() + " ";
    }

    return files;
});

new Command("pwd", "Prints the current working directory.", () =>
{
    return Terminal.instance.fileSystem.currentDir.getPathString();
});

new Command("cat", "Usage: `cat [file]` - Prints file contents.", (fileName: string) =>
{
    const file = Terminal.instance.fileSystem.getFileFromPathString(fileName);
    if (file == undefined) return `File '${fileName}' not found.`;

    if (file.content == undefined) return "You do not have permission to read this file!";
    return file.content;
});

new Command("style", "Usage: `style [styleFile]` - Sets terminal style based on style file (.sty)", (styleFileName: string) =>
{
    let styleFile = Terminal.instance.fileSystem.getFileFromPathString(styleFileName);

    if (styleFile == undefined) styleFile = Terminal.instance.fileSystem.getFileFromPathString(styleFileName + ".sty");
    if (styleFile == undefined) return `Style file '${styleFileName}' not found.`;
        
    const styleName = styleFile.name.replace(".sty", "");
    if (styleFile.content == null) return `Invalid Style file '${styleFileName}.`;

    const style = JSON.parse(styleFile.content);
    if (style == undefined) return `Invalid style file '${styleFileName}'.`;

    Terminal.instance.changeStyle(style, styleFile.getPathString());
    return `${styleName} style activated.`;
});

new Command("help", "Usage: `help (command)` - Get command information.", (command: string | undefined = undefined) =>
{
    const sortedCommands = Command.commands.sort((a, b) => a.name.localeCompare(b.name));

    let commands = "Available commands: ";
    for (const c in sortedCommands)
    {
        commands += Command.commands[c].name;

        if (command != undefined && Command.commands[c].name == command) return Command.commands[c].description;

        if (Number(c) < Command.commands.length - 1) commands += ",";
        commands += " ";
    }
    
    return commands;
});