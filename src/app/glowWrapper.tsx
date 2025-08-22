import styles from "@/app/styles/main.module.css";

type GlowWrapperProps = {
    children: React.ReactNode;
}

export default function GlowWrapper({children} : GlowWrapperProps) {
    return (
        <div id="glow-wrapper">
            <div
            aria-hidden="true"
            id="container-glow"
            className={`glow ${styles.glow} ${styles.container} ${styles["container-glow"]} ${styles['vertical-center']}`}
            style={{
                filter: `blur(4px})`,
                zIndex: 0,
                pointerEvents: "none",
            }}
            >
            {children}
            </div>
            <div style={{ display: "none" }} id="container" className={`${styles.container} ${styles["vertical-center"]}`}>
            {children}
            </div>
        </div>
    );
}