/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_KEY: string
    // Añade más variables de entorno aquí si es necesario
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
