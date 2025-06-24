import Heardle from '@/app/components/items/heardle'

import PageHeader from '../components/items/pageHeader';
import StyleDropDown from '../components/items/styleDropDown';

export default function HeardlePage() {

    return (
        <>
            <PageHeader title="Phineas and Ferbdle" parent="/"/>
            <Heardle/>
            <StyleDropDown/>
        </>
    );
}