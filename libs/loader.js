import { Frontends } from './class'
let es
const load = async function (micro) {
    if (!es) {
        try {
            es = new EventSource('/esbuild').addEventListener('change', () => location.reload())
        } catch (error) {
            es = true
        }
    }
    const frontend = new Frontends(micro)
    frontend.init()
    return
}

const initMap = async function (tmp) {
    for (let item of tmp.microFrontends) {
        let head = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = item?.path?.css;
        head.appendChild(link);
        microFrontend = await import(item?.path?.js)
        load(microFrontend.micro)
    }
}

export { load, initMap }