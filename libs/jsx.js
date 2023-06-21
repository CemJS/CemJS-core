const Cemjsx = (tag, data, ...children) => {
    // console.log('=5af7d7=', this)
    // console.log('=c68c31=', tag, data, children)
    // if (typeof tag == "function") {
    //     // console.log('=0bd458 function=', tag, data)
    //     console.log('=4ce917=', tag())
    // }
    children = children.filter(item => !checkNofing(item))
    let joinchildren = []
    let tmp = ""
    children.forEach((item) => {
        if (typeof item == "object") {
            if (tmp != "") {
                joinchildren.push(tmp)
                tmp = ""
            }
            joinchildren.push(item)
        } else {
            tmp += item.toString()
        }
    })
    if (tmp != "") {
        joinchildren.push(tmp)
    }

    return { tag, data, children: joinchildren }
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
        } else if (name == "ref") {
            return
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

const updateDataElement = function ($el, newData = {}, oldData = {}, Ref) {
    Object.keys(Object.assign({}, newData, oldData)).forEach(name => {
        if (checkDifferent(newData[name], oldData[name])) {
            if (name in oldData && name.startsWith('on') && name.toLowerCase() in window) {
                $el.removeEventListener(name.toLowerCase().substring(2), oldData[name])
            }
            if (name in newData) {
                if (name.startsWith('on') && name.toLowerCase() in window) {
                    $el.addEventListener(name.toLowerCase().substring(2), newData[name])
                } else {
                    if (name == "ref") {
                        return
                    }
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

const createElement = function (node, Data) {
    if (checkNofing(node)) {
        return null
    }
    if (typeof node != "object") {
        return document.createTextNode(node)
    }
    if (typeof node.tag == "function") {
        let tempNode = node.tag.bind(Data)(node.data, node.children)
        node = tempNode
    }
    let $el = document.createElement(node.tag)
    node.$el = $el
    if (node.data?.ref && Data.Ref) {
        Data.Ref[node.data?.ref] = $el
    }
    setDataElement(node.data, $el)
    if (typeof node.children == "object") {
        node.children
            .map(item => createElement(item, Data))
            .filter(item => !checkNofing(item))
            .forEach($el.appendChild.bind($el));
    } else {
        return document.createTextNode(node.tag)
    }
    return $el
}

const updateElement = async function ($el, _VDomNew, _VDomActual, position = 0, Data) {
    let { Ref } = Data

    if (checkNofing(_VDomActual)) {
        $el.appendChild(
            createElement(_VDomNew, Ref)
        );
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
            $el.replaceChild(createElement(_VDomNew, Ref), $el.childNodes[position])
        }
        return
    }

    if (_VDomNew.tag != _VDomActual?.tag) {
        $el.childNodes[position].replaceWith(createElement(_VDomNew, Ref))
        return
    }

    if (!$el) {
        console.error('UpdateElement нет значения $el')
        return
    }

    updateDataElement($el.childNodes[position], _VDomNew?.data, _VDomActual?.data, Ref)
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


const display = (_VDomNew, _VDomActual, $el, Data) => {
    if (!$el) {
        const newDom = createElement(_VDomNew, Data)
        const $app = document.getElementById("app")
        $app.appendChild(newDom)
        return newDom
    }
    updateElement($el, _VDomNew, _VDomActual, 0, Data)
    return $el
}

export { Cemjsx, display }