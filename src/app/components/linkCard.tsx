import styles from "@/app/styles/linkcard.module.css";

type LinkCardProps = {
    title: string,
    description: string
}

function hashString(str: string): string {
  // Simple hash function for demonstration
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function getElementGlow(element: HTMLElement) {
    const siblingID = element.getAttribute("data-sibling-id");
    const glowElement = document.querySelector(`#container-glow [data-sibling-id="${siblingID}"]`);
    return glowElement;
}

function linkCardMouseEnter(event: React.MouseEvent<HTMLDivElement>) {
    const glowElem = getElementGlow(event.currentTarget);
    glowElem?.classList.add("hovered");
}

function linkCardMouseLeave(event: React.MouseEvent<HTMLDivElement>) {
    const glowElem = getElementGlow(event.currentTarget);
    glowElem?.classList.remove("hovered");
}

export default function LinkCard({title, description} : LinkCardProps){
    const hashID = hashString(title + description);
    return (
        <div data-sibling-id={hashID} className={`row ${styles.linkCard}`} onMouseEnter={linkCardMouseEnter} onMouseLeave={linkCardMouseLeave}>
            <div className={`col-10 ${styles.linkCardText}`}>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <div className={`col-2 ${styles.arrowContainer}`}>
                <svg className={styles.arrow} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/>
                </svg>
            </div>
        </div>
    );
}