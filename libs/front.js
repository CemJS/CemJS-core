import Observer from 'deep-observer';

class Front_ {
    constructor() {
        this.Static = new Observer(Static, (e) => {
            let keys = e.keyPath.split(".")
            let newVal = e.object
            let oldVal = e.oldValue
            let isChange = true
            let typ = "Loader/clear"
            let logArr = [`Front: ${this.name}`]
            if (this.$el) {
                typ = "Action"
                logArr.push(`Action: ${e.action}`)
            } else {
                logArr.push(`Loader/clear: ${e.action}`)
            }

            try {
                newVal = e.object[e.name]
                if (typeof newVal == "object" && typeof oldVal == "object") {
                    if (JSON.stringify(newVal) == JSON.stringify(oldVal)) {
                        isChange = false
                    }
                } else {
                    if (newVal == oldVal) {
                        isChange = false
                    }
                }
            } catch (error) {
            }

            logArr.push(`Key =>: ${keys[1]}`)

            if (isChange) {
                logArr.push('\nOld:', oldVal)
                logArr.push("\nNew:", newVal)
            }


            if (this.degubStatic) {
                Fn.log(...logArr)
            }

            if (this.$el) {
                if (!this.InitIgnore.includes(keys[1]) && isChange) {
                    if (this.InitAll.includes(keys[1])) {
                        this.Fn.initAll.bind(this)()
                    } else {
                        this.Fn.init.bind(this)()
                    }
                } else {
                    if (this.degubStatic) {
                        console.log(`Ignore Init key`, keys[1], "isChange", isChange)
                    }
                }
            }
        });

        this.Variable = {}
        this.Ref = {}
        this.func = {}
        this.Fn = {}
        this.Services = {}
        this.Events = {}
        this.listener = {}
        this._ListsEventListener = []
        this._ListsEventSource = []
        this._ListsInit = []
        this._ListsVisible = []
        this._ListsOn = {}
        this.degubStatic = false
        this.InitIgnore = []
        this.InitAll = []
    }
}

var front = new Front_()
const Static = front.Static
const Events = front.Events
const Ref = front.Ref
const Func = front.func
// let Fn = front.Fn

const Fn = {}

Fn.init = async function (index) {
    return await front.Fn.init.bind(front)(index)
}

Fn.initOne = async function (name, data, ifOpen = null) {
    return await front.Fn.initOne.bind(front)(name, data, ifOpen)
}

Fn.initAll = async function () {
    return await front.Fn.initAll.bind(front)()
}

Fn.link = async function (e) {
    return await front.Fn.link.bind(front)(e)
}

Fn.linkChange = async function (link, data = {}) {
    return await front.Fn.linkChange.bind(front)(link, data)
}

Fn.initAuto = async function (keys, fn) {
    return await front.Fn.initAuto.bind(front)(keys, fn)
}

Fn.clearData = async function () {
    return await front.Fn.clearData.bind(front)()
}

Fn.event = async function (url, Listener) {
    return await front.Fn.event.bind(front)(url, Listener)
}

Fn.log = async function (...params) {
    let newlog = []
    for (let item of params) {
        try {
            newlog.push(JSON.parse(JSON.stringify(item)))
        } catch (error) {
            newlog.push(item)
        }
    }
    console.log(...newlog)
    return
}

export { front, Static, Func, Fn, Ref, Events }
