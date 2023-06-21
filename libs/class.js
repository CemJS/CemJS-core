import { display } from './jsx'

class Static {
    constructor(name) {
        this._name = name
    }
}

class Frontends {

    static lists = {}

    constructor(micro) {
        this.name = micro.name
        this.loader = micro.loader
        this.display = micro.display
        this.Static = new Static(this.name)
        Frontends.lists[this.name] = this
    }

    get name() {
        return this._name
    }

    set name(value) {
        this._name = value
    }

    async init() {
        if (!this._VDomActual) {
            await this.loader()
        }
        this._VDomNew = await this.display()
        this.$el = display(this._VDomNew, this._VDomActual, this.$el)
        this._VDomActual = this._VDomNew
    }

}

export { Static, Frontends }