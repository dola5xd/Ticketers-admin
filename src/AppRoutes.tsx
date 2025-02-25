import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { RequireAuth } from "./routes/RequireAuth";
import PublicRoute from "./routes/PublicRoute";
import Spinner from "./components/Spinner";
import ErrorFallback from "./routes/ErrorFallback";

const Layout = lazy(() => import("./pages/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Customers = lazy(() => import("./pages/Customers"));
const Settings = lazy(() => import("./pages/Settings"));
const Cinemas = lazy(() => import("./pages/Cinemas"));
const Events = lazy(() => import("./pages/Events"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./routes/NotFound"));

const AppRoutes = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center dark:bg-tuna-1000 h-screen w-full bg-tuna-50">
          <Spinner />
        </div>
      }
    >
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/events"
            element={
              <RequireAuth>
                <Events />
              </RequireAuth>
            }
          />
          <Route
            path="/customer"
            element={
              <RequireAuth>
                <Customers />
              </RequireAuth>
            }
          />
          <Route
            path="/reviews"
            element={
              <RequireAuth>
                <Reviews />
              </RequireAuth>
            }
          />
          <Route
            path="/cinemas"
            element={
              <RequireAuth>
                <Cinemas />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </ErrorBoundary>
);

export default AppRoutes;
