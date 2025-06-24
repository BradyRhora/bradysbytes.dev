import CommandLink from './commandLink';

import styles from '@/app/styles/main.module.css';

export default function PageHeader({title, parent}: {title: string, parent?: string | null}) {
    return (
        <>
        {parent && <CommandLink className={styles.goBack} href="/">..</CommandLink>}
        <h1 className={styles.header}>/{title}</h1>
        </>
    );
}