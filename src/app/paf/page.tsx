import Heardle from '@/app/components/items/heardle'

import PageHeader from '../components/items/pageHeader';
import StyleDropDown from '../components/items/styleDropDown';

export const metadata = {
    title: "Phineas and Ferbdle",
    description: "Guess the Phineas and Ferb song!"
}

export default function HeardlePage() {
    function isSafari() {
        const ua = navigator.userAgent;
        return (
            /Safari/.test(ua) &&
            !/Chrome|CriOS|Chromium|Android/.test(ua)
        );
    }
    
    return (
        <>
            <PageHeader title="Phineas and Ferbdle" parent="/"/>
            { isSafari() && 
                <p style={{margin: 20}}>Older Safari versions may have issues with playback. Update or try another browser if you experience issues!</p>
            }
            <Heardle/>
            <StyleDropDown/>
        </>
    );
}