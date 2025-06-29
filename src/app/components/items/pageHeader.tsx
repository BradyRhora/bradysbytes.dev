import CommandLink from './commandLink';

import styles from '@/app/styles/main.module.css';

export default function PageHeader({title, path, root = false}: {title: string, path?: string[] | null, root?: boolean}) {
    return (
        <div className={styles.headerContainer}>
            
            <h1 className={styles.header}>
                { !root &&
                <CommandLink className={styles.goBack} href={'/'}>
                    ..
                </CommandLink>
                }
                {path && 
                    path.map((dir) => {
                        return (
                        <span key={dir}>
                        /
                        <CommandLink key={dir} className={styles.goBack} href={'/'+dir}>
                            {dir.toUpperCase()}
                        </CommandLink>
                        </span>
                        );
                    })
                }
                /{title}
            </h1>
        </div>
    );
}