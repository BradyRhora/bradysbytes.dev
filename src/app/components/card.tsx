import styles from "@/app/styles/card.module.css";

type CardProps = {
    title: string,
    content: string
}

export default function Card({title, content} : CardProps){
    return (
        <div className={styles.card}>
            <h2>{title}</h2>
            <p>{content}</p>
        </div>
    );
}