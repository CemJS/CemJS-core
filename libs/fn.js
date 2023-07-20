import { Frontends } from './class'

export const link = function (e) {
    console.log('=link=', e, e.currentTarget, e.target)
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

export const initOne = function ({ name, data, ifOpen }) {
    if (!Frontends.lists[name]) {
        console.error('=d792ce=', "No name =>", name)
        return
    }

    if (Frontends.lists[name].$el) {
        if (ifOpen) {
            ifOpen(Frontends.lists[name])
            return
        }
    }
    Frontends.lists[name].init()
    return

}