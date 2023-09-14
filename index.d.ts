interface jsxResult {
    tag: String,
    data: any,
    children: any[]
}

interface Configs {
    cemjs: any
    pages: any
    frontends: any
    services: any
}

export declare function Cemjsx(tag: String, data: any, ...children: any[]): jsxResult

export declare function initProject(configs: Configs): void
