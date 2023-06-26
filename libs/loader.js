import { Frontends, pageFront } from './class'
import { listener } from './listener'

let cemConfig
const load = async function (micro) {
    const frontend = new Frontends(micro)
    // frontend.init()
    return
}

const initMap = async function (config) {
    new EventSource('/esbuild').addEventListener('change', () => location.reload())
    listener()
    cemConfig = config
    for (let item of config.microFrontends) {
        if (item?.path?.css) {
            let head = document.getElementsByTagName('head')[0];
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = item?.path?.css;
            head.appendChild(link);
        }
        if (item?.path?.js) {
            let microFrontend = await import(item?.path?.js)
            microFrontend.micro.name = item.name
            load(microFrontend.micro)
        }
    }
    history.pushState({}, '', window.location.pathname);
    window.dispatchEvent(new Event('popstate'));
}

export { load, initMap, cemConfig, pageFront }