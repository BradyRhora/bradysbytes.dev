import styles from "@/app/styles/card.module.css";

export default function Card(){
    return (
        <div className={styles.card}>
            <h2>Card Title</h2>
            <p>This is a simple card component. Now, it contains even more text! Fancy that.</p>
        </div>
    );
}