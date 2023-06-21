const Cemjsx = (tag, data, ...children) => {
    children = children.filter(item => !checkNofing(item))
    return { tag, data, children }
}

const checkDifferent = function (data, data2) {
    if (data?.toString() == data2?.toString()) {
        return false
    }
    return true
}

const checkNofing = function (data) {
    if ((!data && typeof data != "number") || data === true) {
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
            if (typeof value == "object") {
                if (name == "class") {
                    value = value.join(" ")
                }
            }
            $el.setAttribute(name, value)
        }
    })
    return
}

const updateDataElement = function ($el, newData = {}, oldData = {}) {
    Object.keys(Object.assign({}, newData, oldData)).forEach(name => {
        if (checkDifferent(newData[name], oldData[name])) {
            if (name in oldData && name.startsWith('on') && name.toLowerCase() in window) {
                $el.removeEventListener(name.toLowerCase().substring(2), oldData[name])
            }
            if (name in newData) {
                if (name.startsWith('on') && name.toLowerCase() in window) {
                    $el.addEventListener(name.toLowerCase().substring(2), newData[name])
                } else {
                    if (typeof newData[name] == "object") {
                        if (name == "class") {
                            newData[name] = newData[name].join(" ")
                        }
                    }
                    $el.setAttribute(name, newData[name])
                }
            } else {
                $el?.removeAttribute(name);
            }
        }
    });
}

const createElement = function (node) {
    if (checkNofing(node)) {
        return null
    }
    if (typeof node != "object") {
        return document.createTextNode(node)
    }
    let $el = document.createElement(node.tag)
    node.$el = $el
    setDataElement(node.data, $el)
    if (typeof node.children == "object") {
        node.children
            .map(createElement)
            .filter(item => !checkNofing(item))
            .forEach($el.appendChild.bind($el));
    } else {
        return document.createTextNode(node.tag)
    }
    return $el
}

const updateElement = async function ($el, _VDomNew, _VDomActual, position = 0) {

    if (checkNofing(_VDomActual)) {
        $el.appendChild(
            createElement(_VDomNew)
        );
        return
    }

    if (checkNofing(_VDomNew)) {
        $el.removeChild(
            $el.childNodes[position]
        );
        return
    }

    if (!_VDomNew?.tag) {
        if (_VDomNew != _VDomActual) {
            $el.replaceChild(createElement(_VDomNew), $el.childNodes[position])
        }
        return
    }

    if (_VDomNew.tag != _VDomActual?.tag) {
        $el.childNodes[position].replaceWith(createElement(_VDomNew))
        return
    }

    if (!$el) {
        console.error('UpdateElement нет значения $el')
        return
    }

    updateDataElement($el.childNodes[position], _VDomNew?.data, _VDomActual?.data)
    _VDomNew.$el = _VDomActual.$el

    for (let i = 0; i < _VDomNew.children.length || i < _VDomActual.children.length; i++) {
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