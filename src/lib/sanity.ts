import { createClient } from "@sanity/client";

const storedUser = sessionStorage.getItem("user");
let isAdmin = false;
if (storedUser) {
  try {
    const user = JSON.parse(storedUser);
    isAdmin = user.role === "admin";
  } catch (error) {
    console.error("Error parsing stored user:", error);
  }
}
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: isAdmin ? import.meta.env.VITE_SANITY_API_TOKEN : "",
});
