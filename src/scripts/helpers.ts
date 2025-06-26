export function isMobile() {
    return screen.availWidth <= 480;
}

export function setCookie(name: string, value: string, lifeMinutes : number | null = null) {
    let lifeTime = 2147483647;
    if (lifeMinutes != null) lifeTime = lifeMinutes * 60;

    document.cookie = `${name}=${value}; Max-Age=${lifeTime}; path=/`
}

export function getCookie(name: string) {
    const cookies = document.cookie.split(";");
    for (const c in cookies) {
        const [key, value] = cookies[c].trim().split('=');
        if (name == key)
            return value;
    }

    return null;
}

export function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function wait(seconds: number) {    
    if (seconds > 0) await new Promise(r => setTimeout(r, seconds * 1000));
}

export function setCSSVar(name: string, value: string) {
    document.documentElement.style.setProperty(name, value);
}

export function roundToDecimalPlaces(value: number, decimals : number) {
    if (isNaN(value)) return value;
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}