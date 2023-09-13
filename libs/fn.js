import { Frontends } from './class'
import { cemConfigs, load } from './loader'

let cemConfig = cemConfigs
const loadFront = async function (front, data) {
    if (cemConfig.microFrontends[front]) {
        if (cemConfig.microFrontends[front]?.path?.css) {
            let head = document.getElementsByTagName('head')[0];
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cemConfig.microFrontends[front]?.path?.css;
            head.appendChild(link);
        }

        if (cemConfig.microFrontends[front]?.path?.js) {
            let microFrontend = await import(cemConfig.microFrontends[front]?.path?.js)
            microFrontend.micro.name = cemConfig.microFrontends[front].name
            await load(microFrontend.micro, cemConfig.microFrontends[front].one)
            initOne(data)
        }
    }
}

export const link = function (e) {
    let $el = e.currentTarget || e.target
    if ($el.href) {
        if (!$el.href.includes(window.location.host)) {
            $el.target = "_blank"
            return
        }
        history.pushState({}, '', $el.href);
        window.dispatchEvent(new Event('popstate'));
        e.preventDefault();
    }
}

export const linkChange = function (link) {
    history.pushState({}, '', link);
    window.dispatchEvent(new Event('popstate'));
}

export const initOne = async function ({ name, data, ifOpen }) {
    if (!Frontends.lists[name]) {
        await loadFront(name, { name, data, ifOpen })
        console.error('=d792ce=', "No name =>", name)
        return
    }

    if (Frontends.lists[name].$el) {
        if (ifOpen) {
            ifOpen(Frontends.lists[name])
            return
        }
    }
    if (typeof data == "object") {
        Object.assign(Frontends.lists[name].Static, data)
    }
    Frontends.lists[name].init()
    return

}


export const initAll = async function () {
    for (let key in Frontends.lists) {
        if (Frontends.lists[key].$el) {
            Frontends.lists[key].init()
        }
    }
}