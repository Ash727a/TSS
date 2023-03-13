declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SIM_STEP_TIME: number;
      API_PORT: number;
      API_URL: string;
      SOCKET_PORT: number;
    }
  }
}

export {};
