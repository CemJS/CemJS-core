import { variable } from './variable'
import * as Fn from './fn'

const clearFront = function (front) {
    variable.pageLists = variable.pageLists.filter((olPage, index) => {
        if (!front.includes(olPage)) {
            variable.frontList[olPage]?.$el?.remove()
            Fn.clearData.bind(variable.frontList[olPage])()
            return false
        }
        return true
    })

    front.map((page, index) => {
        if (variable.frontList[page]) {
            Fn.init.bind(variable.frontList[page])(index)
        }
    })
}

const changeUrl = async function () {
    variable.Variable.DataUrl = window.location.pathname.split("/")
    variable.Variable.DataUrl = variable.Variable.DataUrl.filter(item => item != "")

    for (let item of variable.cemConfigs.pages) {
        if (item.regex && window.location.pathname.search(new RegExp(item.regex)) != -1) {
            clearFront(item.front)
        } else if (item.url && item.url == window.location.pathname) {
            clearFront(item.front)
        }
    }

    if (!variable.pageLists.length) {
        let find = variable.cemConfigs.pages.findIndex(function (item) {
            return item.url == "/error";
        });
        if (find > -1) {
            clearFront(variable.cemConfigs.pages[find].front)
        }
    }
    document.documentElement.scrollIntoView(true)
}

const clickAny = function (e) {
    for (let key in variable.frontList) {
        if (variable.frontList[key].$el) {
            if (variable.frontList[key]?.listener?.clickAny) {
                variable.frontList[key].listener.clickAny(e)
            }
        }
    }
}

const keydownAny = function (e) {
    for (let key in variable.frontList) {
        if (variable.frontList[key].$el) {
            if (variable.frontList[key]?.listener?.keydownAny) {
                variable.frontList[key].listener.keydownAny(e)
            }
        }
    }
}

const keyupAny = function (e) {
    for (let key in variable.frontList) {
        if (variable.frontList[key].$el) {
            if (variable.frontList[key]?.listener?.keyupAny) {
                variable.frontList[key].listener.keyupAny(e)
            }
        }
    }
}

const scrollAny = function (e) {

    // for (let key in variable.frontList) {
    //     if (variable.frontList[key].$el) {
    //         if (variable.frontList[key]?._ListsOn?.scroll) {
    //             variable.frontList[key]._ListsOn.scroll.bind(variable.frontList[key])(e)
    //         }
    //     }
    // }

    let windowPosition = {
        top: window.scrollY,
        left: window.scrollX,
        right: window.scrollX + document.documentElement.clientWidth,
        bottom: window.scrollY + document.documentElement.clientHeight
    };

    for (let key in variable.frontList) {
        if (variable.frontList[key].$el && variable.frontList[key]._ListsVisible.length) {
            variable.frontList[key]._ListsVisible = variable.frontList[key]._ListsVisible.filter((item, index) => {
                let targetPosition = {
                    top: window.scrollY + item.$el.getBoundingClientRect().top,
                    left: window.scrollX + item.$el.getBoundingClientRect().left,
                    right: window.scrollX + item.$el.getBoundingClientRect().right,
                    bottom: window.scrollY + item.$el.getBoundingClientRect().bottom
                }
                if (targetPosition.bottom > windowPosition.top &&
                    targetPosition.top < windowPosition.bottom &&
                    targetPosition.right > windowPosition.left &&
                    targetPosition.left < windowPosition.right) {
                    item.fn.bind(variable.frontList[key])(item.$el);
                    return false
                } else {
                    return true
                }
            })
        }
    }
}

export const listener = function () {
    window.addEventListener('popstate', changeUrl);
    // window.addEventListener('scroll', scrollAny);
    window.addEventListener('click', clickAny);
    document.addEventListener('keydown', keydownAny);
    document.addEventListener('keyup', keyupAny);
}
