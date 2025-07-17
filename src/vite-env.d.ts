/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODE: string;
  // add others...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
