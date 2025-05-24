/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RESOURCE_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
