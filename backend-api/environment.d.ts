declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: string;
        MONGODB_URI: string;
        [key: string]: string | undefined;
      }
    }
  }
  
  export {};