import { readFile, readdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
    const imgDir = path.resolve(process.cwd(), "assets", "me");

    try {
        const files = await readdir(imgDir);
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

        if (imageFiles.length === 0) {
            return new NextResponse("No image found", { status: 404 });
        }

        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        const imgPath = path.resolve(imgDir, imageFiles[randomIndex]);
        const buffer = await readFile(imgPath);

        const ext = path.extname(imgPath).toLowerCase();
        const contentType =
            ext === ".jpg" || ext === ".jpeg"
                ? "image/jpeg"
                : ext === ".png"
                    ? "image/png"
                    : ext === ".gif"
                        ? "image/gif"
                        : "application/octet-stream";

        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: { "Content-Type": contentType },
        });
    } catch {
        return new NextResponse(null, { status: 500 });
    }
}