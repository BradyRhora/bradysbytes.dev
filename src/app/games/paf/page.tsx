import Heardle from '@/app/components/items/heardle/heardle'
import PageHeader from '../../components/items/pageHeader';
import StyleDropDown from '../../components/items/styleDropDown';

import styles from '@/app/styles/paf.module.css'
import Leaderboard from '@/app/components/items/heardle/leaderboard';

export const metadata = {
    title: "Phineas and Ferbdle",
    description: "Phineas and Ferb Heardle! Can you guess today's Phineas and Ferb song?"
}

export default function HeardlePage() {

    return (
        <>
            <PageHeader title="Phineas and Ferbdle" path={["games"]}/>
            <div className={styles.pageContainer}>
                <Heardle/>
                <Leaderboard/>
            </div>
            <div style={{display:"flex", justifyContent:"center"}}>
                <StyleDropDown/>
            </div>
        </>
    );
}