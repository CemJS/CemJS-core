import { openDB } from 'idb';
import { cemConfigs } from './loader'
let idb = {}
let DB

let cache


const idbPut = async function (table, value) {
    try {
        let res = await DB.put(table, value)
        return res
    } catch (error) {
        console.error("idbPut", error)
        return
    }
}

const idbAdd = async function (table, value) {
    try {
        let res = await DB.add(table, value)
        return res
    } catch (error) {
        console.error("idbAdd", error)
        return
    }
}

const idbGet = async function (table, key) {
    try {
        let res = await DB.get(table, key)
        return res
    } catch (error) {
        console.error("idbGet", error)
        return
    }
}

const getFetch = async function (url) {
    return await fetch(url)
}

export { cache, idb, idbGet, idbPut, idbAdd }


export const openChache = async function () {
    try {
        cache = await window.caches.open("v1")
        DB = await openDB('Cache', 1, {
            upgrade: async (db, oldVersion) => {
                if (oldVersion == 0) {
                    const Fronts = db.createObjectStore('Fronts', { keyPath: 'name', });
                    const Services = db.createObjectStore('Services', { keyPath: 'name', });
                }
            },
        });
    } catch (error) {
        console.error('=9b768e openChache=', error)
    }
    return
}



export const getFiles = async function (url, updateChache) {
    if (updateChache) {
        let response = await getFetch(url)
        caches.open(cemConfigs.cemjs.version).then(function (cache) {
            cache.put(url, response);
        });
        return response.clone()
    }

    let cachedResponse = await caches.match(url)
    if (cachedResponse) {
        return cachedResponse
    }
    let response = await getFetch(url)
    caches.open(cemConfigs.cemjs.version).then(function (cache) {
        cache.put(url, response);
    });
    return response.clone()
}