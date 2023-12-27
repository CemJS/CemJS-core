class Front_ {
    constructor() {
        this.Static = {}
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
    }
}

var front = new Front_()
const Static = front.Static
const Events = front.Events
const Ref = front.Ref
const Func = front.func
// let Fn = front.Fn


let handler = {
    get: function (target, name) {
        console.log(target, name)
        return name in target ? target[name] : "Key does not exist";
    }
}

// let Events = front.Events

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

Fn.linkChange = async function (link) {
    return await front.Fn.linkChange.bind(front)(link)
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

export { front, Static, Func, Fn, Ref, Events }
