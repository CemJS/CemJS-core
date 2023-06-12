
const setDataElement = function (data, $el) {
    if (!data) {
        return
    }

    Object.entries(data).forEach(([name, value]) => {
        $el.setAttribute(name, value)
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
    console.log('=56714b=', newDom)
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

export { Cemjsx, load }