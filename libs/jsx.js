const Cemjsx = (tag, data, ...children) => {
    return { tag, data, children }
}

const checkNofing = function (data) {
    if (!data && typeof data != "number") {
        return true
    }
    return false
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
    if (typeof node != "object" || node === null) {
        return document.createTextNode(node)
    }
    let $el = document.createElement(node.tag)
    node.$el = $el
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

const updateElement = async function ($el, _VDomNew, _VDomActual, position = 0) {
    // console.log('=a65f2c=', typeof _VDomActual, $el, _VDomNew, _VDomActual, position)

    if (checkNofing(_VDomActual)) {
        console.log('=94f5e6= нет актуального', $el, _VDomNew, _VDomActual, position)
        $el.appendChild(
            createElement(_VDomNew)
        );
        return
    }

    if (checkNofing(_VDomNew)) {
        console.log('=94f5e6= нет нового', $el, _VDomNew, _VDomActual, position)
        $el.removeChild(
            $el.childNodes[position]
        );
        return
    }

    if (!_VDomNew?.tag) {
        if (_VDomNew != _VDomActual) {
            $el.replaceWith(createElement(_VDomNew))
        }
        console.log('=94f5e6= нет тега', $el, _VDomNew, _VDomActual, position)
        return
    }

    if (!$el) {
        console.log('=d9f996=', "no el", $el, _VDomNew, _VDomActual, position)
        return
    }
    for (let i = 0; i < _VDomNew.children.length || i < _VDomActual.children.length; i++) {
        // console.log('=2ef759=', $el?.childNodes, _VDomActual.children[i], position, i)

        updateElement(
            _VDomActual.$el,
            _VDomNew.children[i],
            _VDomActual.children[i],
            i
        )
    }

}


const display = (_VDomNew, _VDomActual, $el) => {
    if (!$el) {
        const newDom = createElement(_VDomNew)
        const $app = document.getElementById("app")
        $app.appendChild(newDom)
        return newDom
    }
    updateElement($el, _VDomNew, _VDomActual)
    return $el
}

export { Cemjsx, display }