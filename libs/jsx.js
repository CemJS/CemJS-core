const Cemjsx = (tag, data, ...children) => {
    children = children.filter(item => !checkNofing(item))
    let joinchildren = []
    let tmp = ""
    children.forEach((item) => {
        if (typeof item == "object") {
            if (tmp != "") {
                joinchildren.push(tmp)
                tmp = ""
            }
            if (Array.isArray(item)) {
                joinchildren.push(...item)
            } else {
                joinchildren.push(item)
            }
        } else {
            tmp += item.toString()
        }
    })
    if (tmp != "") {
        joinchildren.push(tmp)
    }

    return { tag, data, children: joinchildren }
}

const checkNodeTag = function (node, Data) {
    let tempNode = node.tag.bind(Data)(node.data, node.children)
    if (typeof tempNode?.tag == "function") {
        return checkNodeTag(tempNode, Data)
    }
    return tempNode
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

const setDataElement = function (data, $el, Data) {
    if (!data) { return }
    Object.entries(data).forEach(([name, value]) => {
        if (name.startsWith('on') && name.toLowerCase() in window) {
            let tmpFn = value
            // let tmpFn = value.bind(Data)
            $el.addEventListener(name.toLowerCase().substring(2), tmpFn)
            Data._ListsEventListener.push({ $el, name: name.toLowerCase().substring(2), fn: tmpFn })
        } else if (name == "ref" || name == "init" || name == "isVisible") {
            return
        } else if (name == "html") {
            try {
                $el.innerHTML = value
            } catch (error) { }
            return
        } else {
            if (typeof value == "object") {
                if (name == "class") {
                    value = value.join(" ")
                }
            }

            let checkIgnore = false
            if (name == "disabled" || name == "checked") {
                checkIgnore = true
            }

            if (!checkIgnore) {
                $el.setAttribute(name, value)
            } else {
                if (value || typeof value == "number") {
                    $el.setAttribute(name, value)
                }
            }
        }
    })
    return
}

const setDataElementSvg = function (data, $el) {
    Object.entries(data || {}).forEach(([name, value]) => {
        if (name.startsWith("xmlns")) {
            $el.setAttributeNS("http://www.w3.org/2000/xmlns/", name, value);

        } else {
            $el.setAttribute(name, value);
            // $el.setAttributeNS(null, name, value);
        }
    })
    return $el
}

const updateDataElement = function ($el, newData = {}, oldData = {}, Data) {
    if (!oldData) {
        oldData = {}
    }
    if (!newData) {
        newData = {}
    }
    Object.keys(Object.assign({}, newData, oldData)).forEach(name => {

        if (name.startsWith('on') && name.toLowerCase() in window && name in oldData) {
            $el.removeEventListener(name.toLowerCase().substring(2), oldData[name])
        }


        if (name.startsWith('on') && name.toLowerCase() in window && name in newData) {
            let tmpFn = newData[name]
            // let tmpFn = newData[name].bind(Data)

            $el.addEventListener(name.toLowerCase().substring(2), tmpFn)
            Data._ListsEventListener.push({ $el, name: name.toLowerCase().substring(2), fn: tmpFn })
            return
        }

        if (checkDifferent(newData[name], oldData[name])) {

            if (name in newData) {
                if (!newData[name]) {
                    if (name == "value") {
                        $el.value = ""
                        return
                    }
                    if (name == "html") {
                        try {
                            $el.innerHTML = ""
                        } catch (error) { }
                        return
                    }
                    $el?.removeAttribute(name);
                    return
                }
                if (name == "ref") {
                    if ($el !== Data.Ref[newData[name]]) {
                        Data.Ref[newData[name]] = $el
                    }
                    return
                }
                if (name == "init") {
                    return
                }
                if (name == "isVisible") {
                    return
                }
                if (name == "value") {

                    $el.value = newData[name]
                    return
                }
                if (name == "html") {
                    try {
                        $el.innerHTML = newData[name]
                    } catch (error) { }
                    return
                }
                if (typeof newData[name] == "object") {
                    if (name == "class") {
                        newData[name] = newData[name].join(" ")
                    }
                }

                let checkIgnore = false
                if (name == "disabled" || name == "checked") {
                    checkIgnore = true
                }
                if (!checkIgnore) {
                    $el.setAttribute(name, newData[name])
                } else {
                    if (newData[name] || typeof newData[name] == "number") {
                        $el.setAttribute(name, newData[name])
                    } else {
                        $el?.removeAttribute(name);
                    }
                }

            } else {
                if (name == "value") {
                    $el.value = ""
                    return
                }
                if (name == "html") {
                    try {
                        $el.innerHTML = ""
                    } catch (error) { }
                    return
                }

                $el?.removeAttribute(name);
            }
        }
    });
}

const createElement = function (node, Data, typeSvg) {
    if (checkNofing(node)) {
        return null
    }
    if (typeof node != "object") {
        return document.createTextNode(node)
    }
    if (typeof node.tag == "function") {
        let tempNode = checkNodeTag(node, Data)
        node = tempNode
    }

    let $el
    if (node.tag == "svg" || typeSvg) {
        typeSvg = true
        $el = document.createElementNS("http://www.w3.org/2000/svg", node.tag);
    } else {
        $el = document.createElement(node.tag)
    }
    node.$el = $el
    if (node.data?.ref && Data.Ref) {
        Data.Ref[node.data?.ref] = $el
    }
    if (node.data?.init) {
        Data._ListsInit.push({ $el: $el, fn: node.data?.init })
    }
    if (node.data?.isVisible && typeof node.data?.isVisible == "function") {
        Data._ListsVisible.push({ $el: $el, fn: node.data?.isVisible })
    }
    if (typeSvg) {
        setDataElementSvg(node.data, $el)

    } else {
        setDataElement(node.data, $el, Data)

    }
    if (typeof node.children == "object") {
        node.children
            .map(item => createElement(item, Data, typeSvg))
            .filter(item => !checkNofing(item))
            .forEach($el.appendChild.bind($el));
    } else {
        return document.createTextNode(node.tag)
    }
    return $el
}

const updateElement = async function ($el, _VDomNew, _VDomActual, position = 0, Data) {

    if (checkNofing(_VDomActual)) {
        if (_VDomNew) {
            $el.appendChild(
                createElement(_VDomNew, Data)
            );
        }
        return
    }

    if (checkNofing(_VDomNew)) {
        if (!$el.childNodes[position]) {
            $el.removeChild(
                $el.lastChild
            );

        } else {
            $el.removeChild(
                $el.childNodes[position]
            );
        }
        return
    }

    if (!_VDomNew?.tag) {
        if (_VDomNew != _VDomActual) {
            $el.replaceChild(createElement(_VDomNew, Data), $el.childNodes[position])
        }
        return
    }

    if (_VDomNew.tag != _VDomActual?.tag) {
        $el.childNodes[position].replaceWith(createElement(_VDomNew, Data))
        return
    }

    if (!$el) {
        console.error('UpdateElement нет значения $el')
        return
    }

    let eventIndex = Data._ListsEventListener.findIndex(item => $el.childNodes[position] === item?.$el)
    if (eventIndex >= 0) {
        let item = Data._ListsEventListener[eventIndex]
        item.$el.removeEventListener(item.name, item.fn)
        Data._ListsEventListener.splice(eventIndex, 1)
    }

    updateDataElement($el.childNodes[position], _VDomNew?.data, _VDomActual?.data, Data)
    _VDomNew.$el = _VDomActual.$el

    for (let i = 0; i < _VDomNew.children.length || i < _VDomActual.children.length; i++) {
        updateElement(
            _VDomActual.$el,
            _VDomNew.children[i],
            _VDomActual.children[i],
            i,
            Data
        )
    }
}


const display = (_VDomNew, _VDomActual, $el, Data, index) => {
    if (!$el) {
        const newDom = createElement(_VDomNew, Data)
        const $app = document.getElementById("app")
        if ($app.childNodes.length > index) {
            $app.insertBefore(newDom, $app.childNodes[index])
        } else {
            $app.appendChild(newDom)
        }
        return newDom
    }
    updateElement($el, _VDomNew, _VDomActual, 0, Data)
    return $el
}

export { Cemjsx, display }