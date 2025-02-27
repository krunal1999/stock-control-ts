import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import LandingPage from "./pages/LandingPage";
import Loader from "./component/Loader";

// Lazy load the components
const LoginPage = lazy(() => import("./pages/authenticationPages/LoginPage"));
const RegistrationPage = lazy(
  () => import("./pages/authenticationPages/RegistrationPage")
);
const AdminLayout = lazy(() => import("./layouts/admindashboard/AdminLayout"));
const AdminDashboardPage = lazy(
  () => import("./pages/admindashboard/AdminDashboardPage")
);

const InventoryDashboard = lazy(
  () => import("./pages/admindashboard/InventoryDashboard")
);
const AddInventoryForm = lazy(
  () => import("./pages/admindashboard/AddInventoryForm")
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loader />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<Loader />}>
              <RegistrationPage />
            </Suspense>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<Loader />}>
            <AdminLayout />
          </Suspense>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<Loader />}>
              <AdminDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<Loader />}>
              <AdminDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="inventory"
          element={
            <Suspense fallback={<Loader />}>
              <InventoryDashboard />
            </Suspense>
          }
        />
        <Route
          path="add-product"
          element={
            <Suspense fallback={<Loader />}>
              <AddInventoryForm />
            </Suspense>
          }
        />
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
