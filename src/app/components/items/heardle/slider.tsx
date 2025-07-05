import styles from "@/app/styles/semiComponents.module.css"
import { useEffect, useRef } from "react";
import { getGlowSibling } from "../../wrappers/siblingBinder";

type SliderProps = {
    value: number,
    setValue: (v: number) => void;
    max: number,
    min?: number
}
export default function Slider({value, setValue, max, min = 0} : SliderProps) {
    const barRef = useRef<HTMLDivElement|null>(null);
    const cursorRef = useRef<HTMLDivElement|null>(null);
    
    
    function followMouse() {
        const handleMouseMove = (event: MouseEvent) => {
            const bar = barRef.current;
            if (!bar) return;

            const rect = bar.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const percent = Math.min(1, Math.max(0, (x / bar.clientWidth)));

            const newValue = Math.round((min + (max - min) * percent) * 100) / 100;
            setValue(newValue);
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

    }

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        let percent =  (value - min) / (max - min);
        percent = Math.min(1, Math.max(0, percent)) * 100;

        const left = `calc(${percent}% - ${cursor.getBoundingClientRect().width/2}px)`;
        cursor.style.left = left;
        const glowParent = getGlowSibling(cursor);
        const glow = glowParent?.getElementsByClassName("volCursor")[0] as HTMLElement;
        if (glow) glow.style.left = left;
    }, [value, max, min])

    return (
        <div className={styles.sliderContainer} onMouseDown={followMouse}>
            <div ref={barRef} className={styles.sliderBar}></div>
            <div ref={cursorRef} className={`volCursor ${styles.sliderCursor}`} onMouseDown={followMouse}></div>
        </div>
    )
}