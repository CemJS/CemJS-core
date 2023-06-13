
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
    // console.log('=56714b=', newDom)
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
    // console.log('=e37e54=', tmp)
    for (let item of tmp.microFrontends) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = "tmpcss";
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = `http://127.0.0.1:8000/assets/css/${item.name}.css`;
        link.media = 'all';
        head.appendChild(link);
        let t1 = await import(`http://127.0.0.1:8000/assets/js/${item.name}.js`)
        load(t1.micro)
        // console.log('=ae9b93=', t1.micro)
    }
}

export { Cemjsx, load, initMap }