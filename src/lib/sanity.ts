import { createClient } from "@sanity/client";
import { decodeToken } from "@/context/AuthContext";

export const getSanityClient = () => {
  const storedUser = sessionStorage.getItem("user");
  let token = "";

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user.token) {
        user.token = decodeToken(user.token);
      }
      token = user.token || "";
    } catch (error) {
      console.error("Error parsing stored user:", error);
    }
  }

  return createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: import.meta.env.VITE_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: token,
    ignoreBrowserTokenWarning: true,
  });
};
