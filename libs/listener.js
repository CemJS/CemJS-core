import { cemConfig } from './loader'
import { Frontends, pageFront } from './class'

const changeUrl = async function (e) {
    for (let item of cemConfig.pages) {
        if (item.url == window.location.pathname) {

            for (let olPage of pageFront) {
                if (!item.front.includes(olPage)) {
                    Frontends.lists[olPage].$el.remove()
                    delete Frontends.lists[olPage].$el
                }
            }

            for (let page of item.front) {
                if (Frontends.lists[page]) {
                    Frontends.lists[page].init()
                }
            }
        }
    }
}

export const listener = function () {
    window.addEventListener('popstate', changeUrl);
}