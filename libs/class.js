class Events {
    constructor(url, Listener = []) {
        this.url = url
        this._Listener = Listener
        this.event = new EventSource(url)
        for (let item of this._Listener) {
            this.event.addEventListener(item.type, item.fn)
        }
    }

    addEventListener(type, fn) {
        this._Listener.push({ type, fn })
        this.event.addEventListener(type, fn)
    }

    close() {
        this.event.close()
    }

    change(url, Listener = []) {
        this.event.close()
        this.url = url
        this.event = new EventSource(url)
        if (Listener.length) {
            this._Listener = Listener
        }
        for (let item of this._Listener) {
            this.event.addEventListener(item.type, item.fn)
        }
    }

}




export { Events }