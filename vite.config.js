import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.REACT_APP_API_URL": JSON.stringify(
      process.env.REACT_APP_API_URL
    ),
    "process.env.REACT_APP_API_HOST": JSON.stringify(
      process.env.REACT_APP_API_HOST
    ),
    "process.env.Google_Client_ID": JSON.stringify(
      process.env.Google_Client_ID
    ),
  },
});
