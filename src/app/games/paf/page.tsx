import Heardle from '@/app/games/paf/heardle'
import PageHeader from '../../components/items/pageHeader';

import styles from '@/app/styles/paf.module.css'
import Leaderboard from '@/app/games/paf/leaderboard';

export const metadata = {
    title: "Phineas and Ferbdle",
    description: "Can you guess today's Phineas and Ferb song?"
}

export default function HeardlePage() {

    return (
        <>
            <PageHeader title="Phineas and Ferbdle" path={["games"]}/>
            <div className={styles.pageContainer}>
                <Heardle/>
                <Leaderboard/>
            </div>
        </>
    );
}