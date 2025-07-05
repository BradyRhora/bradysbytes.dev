import Heardle from '@/app/components/items/heardle/heardle'

import PageHeader from '../../components/items/pageHeader';
import StyleDropDown from '../../components/items/styleDropDown';

export const metadata = {
    title: "Phineas and Ferbdle",
    description: "Can you guess today's Phineas and Ferb song?"
}

export default function HeardlePage() {    
    return (
        <>
            <PageHeader title="Phineas and Ferbdle" path={["games"]}/>
            
            <Heardle/>
            <div style={{display:"flex", justifyContent:"center"}}>
            <StyleDropDown/>
            </div>
        </>
    );
}