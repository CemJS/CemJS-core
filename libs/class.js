import { display } from './jsx'
import * as Fn from './fn'

const pageFront = []
const Services = {}
const Variable = {}

const sendOn = function (name, ...data) {

    if (this._LostsOn[name]) {
        this._LostsOn[name].bind(this)(...data)
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
        let tmpp = VDomStartFn(tmp.tag.bind(Data)(), Data)
        return tmpp
    }
    if (tmp.children) {
        tmp.children.forEach((item, index) => {
            tmp.children[index] = VDomStartFn(tmp.children[index], Data)
        })
    }
    return tmp
}



class Frontends {

    static lists = {}

    constructor(micro) {
        this.name = micro.name
        this.loader = micro.loader
        this.display = micro.display
        this.Static = { name: this.name }
        this.Fn = Fn
        this.Services = Services
        this.Variable = Variable
        this.Ref = {}
        this._ListsEventListener = []
        this._ListsEventSource = []
        this._LostsOn = {}
        Frontends.lists[this.name] = this
    }

    on(name, callback) {
        if (typeof callback == "function") {
            this._LostsOn[name] = callback
        }
    }

    services(name, ...data) {
        let [serv, key] = name.split(".")
        if (this.Services[serv] && typeof this.Services[serv][key] == "function") {
            return this.Services[serv][key].bind(this)(...data)
        }
        return null
    }

    eventSource(url, fn) {
        if (this.Variable._Api) {
            url = this.Variable._Api + url
        }
        let tmp = new EventSource(url)
        tmp.addEventListener('open', (e) => {
            console.log("eventSource", e)
        })
        tmp.addEventListener('message', fn)
        tmp.addEventListener('error', (error) => {
            console.error("eventSource", error)
        })
        this._ListsEventSource.push(tmp)
    }

    clearData() {
        this?.$el?.remove()
        delete this.$el
        delete this._VDomNew
        delete this._VDomActual
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
    }

    initAuto(keys, fn) {
        const init = this.init.bind(this)
        if (Array.isArray(keys)) {
            for (let item of keys) {
                if (this.Static[item]) {
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
            if (this.Static[keys]) {
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

    async init(index) {
        sendOn.bind(this)("start", "Start init!", this.name)

        if (!pageFront.includes(this.name)) {
            pageFront.push(this.name)
        }
        if (!this._VDomActual) {
            await this.loader()
        }
        this._VDomNew = VDomStartFn(await this.display(), this)
        this.$el = display(this._VDomNew, this._VDomActual, this.$el, this, index)
        this._VDomActual = this._VDomNew
        this._ListsEventListener = this._ListsEventListener.filter((item) => {
            if (!document.body.contains(item.$el)) {
                item.$el.removeEventListener(item.name, item.fn)
                return false
            }
            return true
        })
        sendOn.bind(this)("finish", "Finish init!", this.name, 1)

    }

}

export { Frontends, pageFront, Services, Variable }