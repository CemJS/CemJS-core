import { Frontends } from './class'

const load = async function (micro) {
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