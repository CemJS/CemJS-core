interface Static {
    [elemName: string]: any;
}

interface Map {
    [elemName: string]: any;
}

interface jsxResult {
    tag: String,
    data: any,
    children: any[]
}

interface Micro {
    name: String,
    loader: Function,
    display: Function,
    Static?: Static
}


export declare function Cemjsx(tag: String, data: any, ...children: any[]): jsxResult

export declare function load(micro: Micro): void

export declare function initMap(micro: Map): void