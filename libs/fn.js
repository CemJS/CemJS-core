import { Frontends} from './class'

export const link = function (e) {
    let $el = e.currentTarget
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

export const initOne = function({name,data}){
    if (!Frontends.lists[name]){
        console.error('=d792ce=',"No name =>",name)
        return
    }

    Frontends.lists[name].init()


}