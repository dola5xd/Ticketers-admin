/* eslint-disable react-refresh/only-export-components */
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./AppRoutes";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient();

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </AuthProvider>

    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          backgroundColor: "#282d36",
          color: "#fff",
          padding: "15px 20px",
        },
      }}
    />
  </QueryClientProvider>
);

export default Root;
