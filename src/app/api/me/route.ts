import { readFile, readdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import sharp, { type Sharp } from "sharp";

export async function GET() {
    const imgDir = path.resolve(process.cwd(), "assets", "me");

    try {
        // Check available images
        const files = await readdir(imgDir);
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

        if (imageFiles.length === 0) {
            return new NextResponse("No image found", { status: 404 });
        }

        // Select one randomly
        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        const imgPath = path.resolve(imgDir, imageFiles[randomIndex]);
        const buffer = await readFile(imgPath);

        // Determine relevant content type
        const ext = path.extname(imgPath).toLowerCase();
        const contentType = GetContentTypeFromExt(ext);
        const isAnimated = ext === ".gif";

        const img = await sharp(buffer, {
            animated: isAnimated,
        });

        // Composite text
        const text = GetRandomText();
        const finalImg = isAnimated ? await img.toBuffer() : await AddText(img, GetRandomText());

        return new NextResponse(new Uint8Array(finalImg), {
            status: 200,
            headers: { "Content-Type": contentType },
        });
    } catch {
        return new NextResponse(null, { status: 500 });
    }
}

function GetRandomText() {
    const strings = [
        "hi there",
        "thank u for viewing me",
        "can i help u",
        "%t is my favourite time",
        "happy %w",
        "TGI%d!"
    ]

    const selected = strings[Math.floor(Math.random() * strings.length)];
    return selected.replace("%t", GetTime()).replace("%w", GetWeekday("long")).replace("%d", GetWeekday("narrow"));
}

function GetWeekday(format: "long" | "short"| "narrow") {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: format };
    return date.toLocaleDateString('en-US', options);
}

function GetTime() {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: "2-digit", hour12: true };
    return date.toLocaleTimeString('en-US', options);
}

function GetContentTypeFromExt(ext: string) {
    return ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".png"
            ? "image/png"
            : ext === ".gif"
                ? "image/gif"
                : "application/octet-stream";
}

async function AddText(img: Sharp, text: string) {
    const textBuffer = await sharp({text:{
        text: text,
        align: "center",
        font: "sans",
        height: 72,
        width: (await img.metadata()).width
    }}).jpeg().toBuffer();

    return await img.composite([{input: textBuffer, gravity: "south"}]).jpeg().toBuffer();
}