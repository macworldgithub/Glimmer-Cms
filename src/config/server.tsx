export const developmentServer = "http://localhost:3000";
export const productionServer = "https://api.glimmer.com.pk";

const curr_env: "Prod" | "DEV" = "Prod";

// export const BACKEND_URL =
//   //@ts-ignore
curr_env === "Prod" ? developmentServer : productionServer;
export const BACKEND_URL = "https://www.api.glimmer.com.pk";
