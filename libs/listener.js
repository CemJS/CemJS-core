import { cemConfig, load } from './loader'
import { Frontends, pageFront } from './class'
import { Variable } from './class'

const loadFront = async function (front, index) {
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
            initFront(front, index)
        }
    }
}


const initFront = async function (front, index) {
    if (typeof front == "string") {
        if (Frontends.lists[front]) {
            Frontends.lists[front].init(index)
        } else {
            await loadFront(front)
        }
        return
    }
    front.map((page, index) => {
        if (Frontends.lists[page]) {
            Frontends.lists[page].init(index)
        } else {
            loadFront(page, index)
        }
    })
}

const clearFront = function (front) {
    pageFront.lists = pageFront.lists.filter((olPage, index) => {
        if (!front.includes(olPage)) {
            Frontends.lists[olPage]?.$el?.remove()
            Frontends.lists[olPage].clearData()
            return false
        }
        return true
    })
    initFront(front)
}

const changeUrl = async function (e) {
    Variable.DataUrl = window.location.pathname.split("/")
    Variable.DataUrl = Variable.DataUrl.filter(item => item != "")
    for (let item of cemConfig.pages) {
        if (item.all) {
            initFront(item.front)
        } else if (item.regex && window.location.pathname.search(new RegExp(item.regex)) != -1) {
            clearFront(item.front)
        } else if (item.url && item.url == window.location.pathname) {
            clearFront(item.front)
        }
    }
    document.documentElement.scrollIntoView(true)
}

const clickAny = function (e) {
    for (let key in Frontends.lists) {
        if (Frontends.lists[key].$el) {
            if (Frontends.lists[key]?._ListsOn?.clickAny) {
                Frontends.lists[key]._ListsOn.clickAny.bind(Frontends.lists[key])(e)
            }
        }
    }
}

const keydownAny = function (e) {

    for (let key in Frontends.lists) {
        if (Frontends.lists[key].$el) {
            if (Frontends.lists[key]?._ListsOn?.keydownAny) {
                Frontends.lists[key]._ListsOn.keydownAny.bind(Frontends.lists[key])(e)
            }
        }
    }
}

const keyupAny = function (e) {
    for (let key in Frontends.lists) {
        if (Frontends.lists[key].$el) {
            if (Frontends.lists[key]?._ListsOn?.keyupAny) {
                Frontends.lists[key]._ListsOn.keyupAny.bind(Frontends.lists[key])(e)
            }
        }
    }
}

export const listener = function () {
    window.addEventListener('popstate', changeUrl);
    window.addEventListener('click', clickAny);
    document.addEventListener('keydown', keydownAny);
    document.addEventListener('keyup', keyupAny);
}
