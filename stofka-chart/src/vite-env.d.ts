/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // 다른 환경변수를 여기에 추가할 수 있어요
    // readonly VITE_ANOTHER_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  