import { Frontends, Services, Variable } from './class'
import { listener } from './listener'
import { getFiles } from './cache'

let cemConfigs = {}

const load = async function (front) {
    const frontend = new Frontends(front)
    if (front.listener) {
        for (let key in front.listener) {
            frontend.on(key, front.listener[key])
        }
    }
    return
}


const initProject = async function (configs) {
    if (!configs.cemjs || !configs.pages || !configs.frontends || !configs.services) {
        console.error("Incorrect configurations")
        return
    }

    cemConfigs = configs
    listener()

    if (configs.cemjs.live) {
        new EventSource('/esbuild').addEventListener('change', () => location.reload())
    }

    if (configs.cemjs.eventApi) {
        Variable._EventApi = configs.cemjs.eventApi
    }

    if (configs.cemjs.api) {
        Variable._Api = configs.cemjs.api
    }

    let files = []
    configs.services.map(item => {
        files.push(item.path.js)
    })
    configs.frontends.map(item => {
        files.push(item.path.js)
        if (item.path.css) {
            files.push(item.path.css)
        }
    })

    let nowCheck = 0

    for (let item of configs.services) {
        nowCheck++
        if (item.path?.js) {
            let response = await getFiles(item.path?.js, configs.cemjs.live)
            var objectURL = URL.createObjectURL(await response.blob());
            Services[item.name] = await import(objectURL)
            if (typeof Services[item.name].loader == "function") {
                await Services[item.name].loader(Variable, Frontends, Services)
            }
        }
        if (typeof Services["preloader"]?.progress == "function") {
            Services["preloader"].progress({ total: files.length, load: nowCheck })
        }
    }

    for (let item of configs.frontends) {
        nowCheck++
        if (item.path?.js) {
            let response = await getFiles(item.path?.js, configs.cemjs.live)
            var objectURL = URL.createObjectURL(await response.blob());
            let { frontend } = await import(objectURL)
            if (frontend) {
                frontend.name = item.name
                await load(frontend)
            }
        }

        if (item.path?.css) {
            nowCheck++
            let response = await getFiles(item.path?.css, configs.cemjs.live)
            var objectURL = URL.createObjectURL(await response.blob());
            let head = document.getElementsByTagName('head')[0];
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = objectURL;
            head.appendChild(link);
        }
        if (typeof Services["preloader"]?.progress == "function") {
            Services["preloader"].progress({ total: files.length, load: nowCheck })
        }
    }
    history.pushState({}, '', window.location.pathname);
    window.dispatchEvent(new Event('popstate'));
}

export { initProject, load, cemConfigs }