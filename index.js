let CEM = {}

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

const display = (node) => {
    const $app = document.getElementById("app")
    const newDom = createElement(node)
    $app.appendChild(newDom)
}


const Cemjsx = (tag, data, ...children) => {
    return { tag, data, children }
}

const load = async function (micro) {
    micro.Static = {}
    await micro.loader()
    const tmp = await micro.display()
    display(tmp)
}

const initMap = async function (tmp) {
    for (let item of tmp.microFrontends) {
        let head = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = item.css;
        head.appendChild(link);
        microFrontend = await import(item.js)
        load(microFrontend.micro)
    }
}

export { Cemjsx, load, initMap, CEM }