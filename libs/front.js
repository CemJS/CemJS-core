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
const Variable = front.Variable

const Ref = front.Ref
const Func = front.func
const Listener = front.listener
// let Fn = front.Fn
const Services = front.Services
// let Events = front.Events

const Fn = {}

Fn.init = async function (index) {
    return await front.Fn.init.bind(front)(index)
}

Fn.link = async function (e) {
    return await front.Fn.link.bind(front)(e)
}

Fn.initAuto = async function (keys, fn) {
    return await front.Fn.initAuto.bind(front)(keys, fn)
}

Fn.clearData = async function () {
    return await front.Fn.clearData.bind(front)()
}


export { front, Static, Variable, Func, Fn, Services, Ref, Listener }
