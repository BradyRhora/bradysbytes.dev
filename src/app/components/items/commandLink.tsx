"use client";
import Link from "next/link";

import { Terminal } from "@/scripts/terminal";

type CommandLinkProps = {
    children: React.ReactNode,
    href: string,
    className?: string
}

export default function CommandLink({children, href, className} : CommandLinkProps) {
    async function changeDirectory() {
        await Terminal.instance.autoCommand("cd " + href);
    }

    return (
        <Link href={href} className={className} onClick={changeDirectory}>{children}</Link>
    )
}