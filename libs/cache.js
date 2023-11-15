import { variable } from './variable'

const getFetch = async function (url) {
    return await fetch(url)
}

export const getFiles = async function (url) {
    if (variable.cemConfigs.cemjs.live) {
        let response = await getFetch(url)
        caches.open(variable.cemConfigs.cemjs.version).then(function (cache) {
            cache.put(url, response);
        });
        return response.clone()
    }

    let cachedResponse = await caches.match(url)
    if (cachedResponse) {
        return cachedResponse
    }
    let response = await getFetch(url)
    caches.open(variable.cemConfigs.cemjs.version).then(function (cache) {
        cache.put(url, response);
    });
    return response.clone()
}