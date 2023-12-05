declare global {
    namespace NodeJS {
      interface Global {
        CachedEmojis?: {
            [key: string]: string;
        };
      }
    }
  }