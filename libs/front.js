import Observer from 'deep-observer';

class Front_ {
    constructor() {
        this.Static = new Observer(Static, (e) => {
            let keys = e.keyPath.split(".")
            if (this.$el) {
                if (this.degubStatic) {
                    console.log(`${this.name} Action: ${e.action}! Key => ${keys[1]}`);
                }
                if (!this.InitIgnore.includes(keys[1])) {
                    this.Fn.init.bind(this)()
                } else {
                    console.log("Ignore Init", keys[1])
                }
            } else if (this.degubStatic) {
                console.log(`${this.name} Loader/clear: ${e.action}! Key => ${keys[1]}`);
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

    }
}

// const Static = new Observer(front.Static, (e) => {
//     let keys = e.keyPath.split(".")
//     // console.log('=e8bc83=', e)
//     if (front.$el) {
//         if (front.degubStatic) {
//             console.log(`Action: ${e.action}! Key => ${keys[1]}`);
//         }
//         front.Fn.init.bind(front)()
//     } else if (front.degubStatic) {
//         console.log(`Loader: ${e.action}! Key => ${keys[1]}`);
//     }
// });

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

export { front, Static, Func, Fn, Ref, Events }
