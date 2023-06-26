export const link = function (e) {
    let $el = e.currentTarget
    e.preventDefault();

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
