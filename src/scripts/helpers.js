export function isMobile() {
    return screen.availWidth <= 480;
}

export function setCookie(name, value, lifeMinutes = undefined) {
    let lifeTime = "2147483647";
    if (lifeMinutes != undefined) lifeTime = lifeMinutes * 60;

    document.cookie = `${name}=${value}; Max-Age=${lifeTime}; path=/`
}

export function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (const c in cookies) {
        let [key, value] = cookies[c].trim().split('=');
        if (name == key)
            return value;
    }

    return undefined;
}

export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function wait(seconds) {    
    if (seconds > 0) await new Promise(r => setTimeout(r, seconds * 1000));
}

export function setCSSVar(name, value) {
    document.documentElement.style.setProperty("--" + name, value);
}