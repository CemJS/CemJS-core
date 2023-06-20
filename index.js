let CEM = {}


class Static {
    constructor(name) {
        this._name = name
    }
}

class Frontends {

    static lists = {}

    constructor(micro) {
        this.name = micro.name
        this.loader = micro.loader
        this.display = micro.display
        this.Static = new Static(this.name)
        Frontends.lists[this.name] = this
    }

    get name() {
        return this._name
    }

    set name(value) {
        this._name = value
    }

    async init() {
        if (!this._VDom) {
            await this.loader()
        }
        this._VDomObj = await this.display()
        this._VDom = display(this._VDomObj, this._VDom)
    }

}


const display = (_VDomObj, $el) => {
    const newDom = createElement(_VDomObj)
    if (!$el) {
        const $app = document.getElementById("app")
        $app.appendChild(newDom)
    } else {
        $el.removeChild(
            $el.childNodes[1]
        )
    }

    return newDom
}


const setDataElement = function (data, $el) {
    if (!data) { return }

    Object.entries(data).forEach(([name, value]) => {
        if (name.startsWith('on') && name.toLowerCase() in window) {
            $el.addEventListener(name.toLowerCase().substring(2), value)
        } else {
            $el.setAttribute(name, value)
        }
    })

    return
}

const createElement = function (node) {

    if (typeof node != "object") {
        return document.createTextNode(node)
    }

    let $el = document.createElement(node.tag)
    setDataElement(node.data, $el)

    if (typeof node.children == "object") {
        node.children
            .map(createElement)
            .forEach($el.appendChild.bind($el));
    } else {
        return document.createTextNode(node.tag)
    }

    return $el
}




const Cemjsx = (tag, data, ...children) => {
    return { tag, data, children }
}

const load = async function (micro) {
    const frontend = new Frontends(micro)
    frontend.init()
    return
}

const initMap = async function (tmp) {
    for (let item of tmp.microFrontends) {
        let head = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = item?.path?.css;
        head.appendChild(link);
        microFrontend = await import(item?.path?.js)
        load(microFrontend.micro)
    }
}

export { Cemjsx, load, initMap, CEM }