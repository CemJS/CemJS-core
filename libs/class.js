import { display } from './jsx'
import * as Fn from './fn'

let pageFront = []


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
        this.Ref = {}
        this._ListsEventListener = []
        Frontends.lists[this.name] = this
    }


    clearData() {
        delete this.$el
        delete this._VDomNew
        delete this._VDomActual
        this.Static = { name: this.name }
        this.Ref = {}
        this._ListsEventListener = this._ListsEventListener.filter((item) => {
            item.$el.removeEventListener(item.name, item.fn)
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

    async init() {
        if (!pageFront.includes(this._name)) {
            pageFront.push(this._name)
        }
        if (!this._VDomActual) {
            await this.loader()
        }
        this._VDomNew = VDomStartFn(await this.display(), this)
        this.$el = display(this._VDomNew, this._VDomActual, this.$el, this)
        this._VDomActual = this._VDomNew


        this._ListsEventListener = this._ListsEventListener.filter((item) => {
            if (!document.body.contains(item.$el)) {
                item.$el.removeEventListener(item.name, item.fn)
                return false
            }
            return true
        })
    }

}

export { Frontends, pageFront }