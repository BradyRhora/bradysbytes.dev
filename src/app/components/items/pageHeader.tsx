import CommandLink from './commandLink';

import styles from '@/app/styles/main.module.css';

export default function PageHeader({title, parent}: {title: string, parent?: string | null}) {
    return (
        <div className={styles.headerContainer}>
            
            <h1 className={styles.header}>
                {parent && <CommandLink className={styles.goBack} href="/">..</CommandLink>}/{title}
            </h1>
        </div>
    );
}