import { Frontends, Services, Variable } from './class'
import { listener } from './listener'
import { openChache, cache, idbGet, idbPut, idbAdd } from './cache'

let cemConfig
const load = async function (micro, one) {
    const frontend = new Frontends(micro)
    if (micro.listener) {
        for (let key in micro.listener) {
            frontend.on(key, micro.listener[key])
        }
    }
    if (one) {
        if (one === true) {
            new EventSource('/esbuild').addEventListener('change', () => location.reload())
        }
        frontend.init()
    }
    return
}

const initMap = async function (config) {
    new EventSource('/esbuild').addEventListener('change', () => location.reload())
    await openChache()
    listener()
    cemConfig = config
    if (cemConfig?.api) {
        Variable._Api = cemConfig.api
    }

    let i = 0
    let totalMicro = Object.keys(config.services).length
    totalMicro += Object.keys(config.microFrontends).length

    for (let key in config.services) {
        i++
        if (config.services[key]?.path?.js) {
            Services[key] = await import(`${config.services[key]?.path?.js}?ver=${config.services[key].ver}`)
            if (typeof Services[key].loader == "function") {
                await Services[key].loader(Variable)
            }
        }
        if (typeof Services["preloader"]?.progress == "function") {
            Services["preloader"]?.progress({ total: totalMicro, load: i })
        }
    }

    for (let key in config.microFrontends) {
        i++
        if (config.microFrontends[key]?.path?.css) {
            let head = document.getElementsByTagName('head')[0];
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = `${config.microFrontends[key]?.path?.css}?ver=${config.microFrontends[key].ver}`;
            head.appendChild(link);
        }
        if (config.microFrontends[key]?.path?.js) {
            let microFrontend = await import(`${config.microFrontends[key]?.path?.js}?ver=${config.microFrontends[key].ver}`)
            microFrontend.micro.name = config.microFrontends[key].name
            await load(microFrontend.micro, config.microFrontends[key].one)
        }
        if (typeof Services["preloader"]?.progress == "function") {
            Services["preloader"]?.progress({ total: totalMicro, load: i })
        }
    }
    history.pushState({}, '', window.location.pathname);
    window.dispatchEvent(new Event('popstate'));
}

export { load, initMap, cemConfig }