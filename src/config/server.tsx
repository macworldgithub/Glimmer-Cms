export const developmentServer = "http://localhost:3000";
export const productionServer = "https://api.glimmer.com.pk";

const curr_env: "Prod" | "DEV" = "DEV";

// export const BACKEND_URL =
//   //@ts-ignore
curr_env === "DEV" ? developmentServer : productionServer;
export const BACKEND_URL = "https://www.api.glimmer.com.pk";
// export const BACKEND_URL = "http://localhost:3000";
