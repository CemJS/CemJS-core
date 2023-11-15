import { Events } from './class'
import { load } from './loader'
import { variable } from './variable'
import { display } from './jsx'

const sendOn = function (name, ...data) {

    if (this._ListsOn[name]) {
        this._ListsOn[name].bind(this)(...data)
    }
}

const checkDifferent = function (data, data2) {
    if (data?.toString() == data2?.toString()) {
        return false
    }
    return true
}

const VDomStartFn = function (_VDomNew, Data) {
    if (typeof _VDomNew != "object") {
        return _VDomNew
    }
    let tmp = { tag: _VDomNew.tag, data: _VDomNew.data, children: _VDomNew.children }
    if (typeof tmp.tag == "function") {
        let tmpp = VDomStartFn(tmp.tag.bind(Data)(tmp.data), Data)
        return tmpp
    }
    if (tmp.children) {
        tmp.children.forEach((item, index) => {
            tmp.children[index] = VDomStartFn(tmp.children[index], Data)
        })
    }
    return tmp
}

const loadFront = async function (front, data) {
    if (variable.cemConfigs.microFrontends[front]) {
        if (variable.cemConfigs.microFrontends[front]?.path?.css) {
            let head = document.getElementsByTagName('head')[0];
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = variable.cemConfigs.microFrontends[front]?.path?.css;
            head.appendChild(link);
        }

        if (variable.cemConfigs.microFrontends[front]?.path?.js) {
            let microFrontend = await import(variable.cemConfigs.microFrontends[front]?.path?.js)
            microFrontend.micro.name = variable.cemConfigs.microFrontends[front].name
            await load(microFrontend.micro, variable.cemConfigs.microFrontends[front].one)
            initOne(data)
        }
    }
}

export const link = function (e) {
    let $el = e.currentTarget || e.target
    if ($el.href) {
        if (!$el.href.includes(window.location.host)) {
            $el.target = "_blank"
            return
        }
        history.pushState({}, '', $el.href);
        window.dispatchEvent(new Event('popstate'));
        e.preventDefault();
    }
}

export const linkChange = function (link) {
    history.pushState({}, '', link);
    window.dispatchEvent(new Event('popstate'));
}

export const initOne = async function ({ name, data, ifOpen }) {
    if (!variable.frontList[name]) {
        await loadFront(name, { name, data, ifOpen })
        console.error('=d792ce=', "No name =>", name)
        return
    }

    if (variable.frontList[name].$el) {
        if (ifOpen) {
            ifOpen(variable.frontList[name])
            return
        }
    }
    if (typeof data == "object") {
        Object.assign(variable.frontList[name].Static, data)
    }
    // variable.frontList[name].init()
    init.bind(variable.frontList[name])()
    return

}


export const initAll = async function () {
    for (let key in variable.frontList) {
        if (variable.frontList[key].$el) {
            variable.frontList[key].init()
        }
    }
}


export const init = async function async(index) {
    if (this.listener.start) {
        this.listener.start()
    }

    if (!variable.pageLists.includes(this.name)) {
        variable.pageLists.push(this.name)
    }

    if (!this._VDomActual) {
        await this.loader()
    }
    this._VDomNew = VDomStartFn(await this.display(), this)

    this.$el = display(this._VDomNew, this._VDomActual, this.$el, this, index)
    this._VDomActual = this._VDomNew
    if (this._ListsInit.length) {
        for (let item of this._ListsInit) {
            item.fn.bind(this)(item.$el)
        }
        this._ListsInit = []
    }

    this._ListsEventListener = this._ListsEventListener.filter((item) => {
        if (!document.body.contains(item.$el)) {
            item.$el.removeEventListener(item.name, item.fn)
            return false
        }
        return true
    })

    if (this.listener.finish) {
        this.listener.finish()
    }

}

export const initAuto = function (keys, fn) {
    const init = this.init.bind(this)
    if (Array.isArray(keys)) {
        for (let item of keys) {
            if (typeof this.Static[item] != "undefined") {
                this.Static[`_${item}`] = this.Static[item]
            }
            this.Static.__defineGetter__(item, function () {
                return this[`_${item}`]
            });
            this.Static.__defineSetter__(item, function (value) {
                if (fn && fn(value, item)) {
                    this[`_${item}`] = value;
                    init()
                } else if (!fn && checkDifferent(this[`_${item}`], value)) {
                    this[`_${item}`] = value;
                    init()
                }
            });
        }
    } else {
        if (typeof this.Static[keys] != "undefined") {
            this.Static[`_${keys}`] = this.Static[keys]
        }
        this.Static.__defineGetter__(keys, function () {
            return this[`_${keys}`]
        });
        this.Static.__defineSetter__(keys, function (value) {
            if (fn && fn(value, keys)) {
                this[`_${keys}`] = value;
                init()
            } else if (!fn && checkDifferent(this[`_${keys}`], value)) {
                this[`_${keys}`] = value;
                init()
            }
        });
    }
}

export const clearData = function () {
    this?.$el?.remove()
    delete this.$el
    delete this._VDomNew
    delete this._VDomActual

    if (this.Static.setInterval) {
        clearInterval(this.Static.setInterval)
    }

    if (this.Static.setTimeout) {
        clearTimeout(this.Static.setTimeout)
    }

    this.Static = { name: this.name }
    this.Ref = {}

    this._ListsEventListener = this._ListsEventListener.filter((item) => {
        item.$el.removeEventListener(item.name, item.fn)
        return false
    })

    this._ListsEventSource = this._ListsEventSource.filter((item) => {
        item.close()
        return false
    })

    this.Events = {}
    this._ListsVisible = []
}

export const cross = function (data) {
    for (let item of Cross[this.name]) {
        if (Frontends.lists[item.name]?.$el)
            item.fn.bind(Frontends.lists[item.name])(data)
    }
}




export const services = function (name, ...data) {
    let [serv, key] = name.split(".")
    if (this.Services[serv] && typeof this.Services[serv][key] == "function") {
        return this.Services[serv][key].bind(this)(...data)
    }
    return null
}

export const event = function (url, Listener) {
    let event = new Events(url, Listener)
    this._ListsEventSource.push(event)
    return event
}

export const eventSource = function (url) {
    if (this.Variable._Api) {
        url = this.Variable._Api + url
    }
    let event = new Events(url)
    this._ListsEventSource.push(event)
    return event
}

export const eventSourceChange = function (url) {
    this._ListsEventSource[0].close()
    this._ListsEventSource = []
    if (this.Variable._Api) {
        url = this.Variable._Api + url
    }
    let event = new Events(url)
    this._ListsEventSource.push(event)
    return event
}