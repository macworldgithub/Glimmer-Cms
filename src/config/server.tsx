export const developmentServer = "http://localhost:3000";
export const productionServer = "https://www.api.glimmer.com.pk";

const curr_env = "Prod";

export const BACKEND_URL =
  curr_env === "DEV" ? developmentServer : productionServer;
