import { cemConfig } from './loader'
import { Frontends, pageFront } from './class'


const initFront = function (front) {
    front.map((page, index) => {
        if (Frontends.lists[page]) {
            Frontends.lists[page].init(index)
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
    for (let item of cemConfig.pages) {
        let checkReg = false
        if (item.all) {
            initFront(item.front)
        } else if (item.regex && window.location.pathname.search(new RegExp(item.regex)) != -1) {
            clearFront(item.front)
        } else if (item.url && item.url == window.location.pathname) {
            clearFront(item.front)
        }
    }
}

export const listener = function () {
    window.addEventListener('popstate', changeUrl);
}