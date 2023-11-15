
import { variable } from './variable'
import { listener } from './listener'
import { getFiles } from './cache'
import * as Fn from './fn'


const load = async function (front) {
    front.Fn = Fn
    front.Variable = variable.Variable
    front.Services = variable.Services

    // front._ListsEventListener = []
    // front._ListsEventSource = []
    // front._ListsInit = []
    // front._ListsVisible = []
    // front._ListsOn = {}

    variable.frontList[front.name] = front
    return
}

const loadFiles = async function (name, path, type) {
    if (!path) {
        return
    }

    let response = await getFiles(path);
    var objectURL = URL.createObjectURL(await response.blob());

    if (type == "front") {
        let { front } = await import(objectURL)
        if (front) {
            front.name = name
            await load(front)
        }
        return
    }

    if (type == "style") {
        let head = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = objectURL;
        head.appendChild(link);
        return
    }

    if (type == "service") {
        variable.Services[name] = await import(objectURL)
        if (typeof variable.Services[name].loader == "function") {
            await variable.Services[name].loader(variable.Variable)
        }
        return
    }

}

const initProject = async function (configs) {
    if (!configs.cemjs || !configs.pages || !configs.frontends || !configs.services) {
        console.error("Incorrect configurations")
        return
    }
    variable.cemConfigs = configs
    listener()

    if (configs.cemjs.live) {
        new EventSource('/esbuild').addEventListener('change', () => location.reload())
    }

    let files = []
    let nowCheck = 0

    configs.services.map(item => {
        files.push(item.path.js)
    })

    configs.frontends.map(item => {
        files.push(item.path.js)
        if (item.path.css) {
            files.push(item.path.css)
        }
    })

    for (let item of configs.services) {
        nowCheck++
        await loadFiles(item.name, item.path?.js, "service")
        if (typeof variable.Services["preloader"]?.progress == "function") {
            variable.Services["preloader"].progress({ total: files.length, load: nowCheck })
        }
    }

    for (let item of configs.frontends) {
        nowCheck++
        await loadFiles(item.name, item.path?.js, "front")
        if (item.path?.css) {
            nowCheck++
            await loadFiles(item.name, item.path?.css, "style")
        }
        if (typeof variable.Services["preloader"]?.progress == "function") {
            variable.Services["preloader"].progress({ total: files.length, load: nowCheck })
        }
    }

    history.pushState({}, '', window.location.pathname);
    window.dispatchEvent(new Event('popstate'));
}

export { initProject, load }