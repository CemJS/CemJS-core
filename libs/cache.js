import { openDB } from 'idb';

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

export { cache, idb, idbGet, idbPut, idbAdd }


export const openChache = async function () {
    cache = await caches.open("v1")

    DB = await openDB('Cache', 1, {
        upgrade: async (db, oldVersion) => {
            if (oldVersion == 0) {
                const Fronts = db.createObjectStore('Fronts', { keyPath: 'name', });
                const Services = db.createObjectStore('Services', { keyPath: 'name', });
            }
        },
    });
    return
}