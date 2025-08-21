import { JSX } from 'react';
import CommandLink from './commandLink';

import styles from '@/app/styles/main.module.css';

export default function PageHeader({title, path, isRoot = false}: {title: string, path?: string[] | null, isRoot?: boolean}) {
    const links: JSX.Element[] = [];
    if (path) {
        for (let i = 0; i < path.length; i++) {
            links.push(
                <span key={path[i]}>
                    /
                    <CommandLink key={path[i]} className={styles.goBack} href={'/' + path.slice(0,i+1).join('/')}>
                        {path[i].toUpperCase()}
                    </CommandLink>
                </span>
            )
        }
    }

    return (
        <div className={styles.headerContainer}>
            
            <h1 className={styles.header}>
                { !isRoot &&
                <CommandLink className={styles.goBack} href={'/'}>
                    ..
                </CommandLink>
                }
                {links}
                /{title}
            </h1>
        </div>
    );
}