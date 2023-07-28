import { cemConfig } from './loader'
import { Frontends, pageFront } from './class'

const changeUrl = async function (e) {
    for (let item of cemConfig.pages) {
        let checkReg = false
        if (item.regex) {
            let regex = new RegExp(item.regex)
            if (window.location.pathname.search(new RegExp(item.regex)) != -1) {
                checkReg = true
            }
        }
        if ((item.url && item.url == window.location.pathname) || checkReg) {
            pageFront.lists = pageFront.lists.filter((olPage, index) => {
                if (!item.front.includes(olPage)) {
                    Frontends.lists[olPage]?.$el?.remove()
                    Frontends.lists[olPage].clearData()
                    return false
                }
                return true
            })

            item.front.map((page, index) => {
                if (Frontends.lists[page]) {
                    Frontends.lists[page].init(index)
                }
            })
            return

        } else if (item.regex && item.regex == window.location.pathname) {

        }
    }
}

export const listener = function () {
    window.addEventListener('popstate', changeUrl);
}