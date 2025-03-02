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
const ProductUpdate = lazy(
  () => import("./pages/admindashboard/ProductUpdate")
);
const CategoryPage = lazy(() => import("./pages/admindashboard/CategoryPage"));
const WarehouseComponent = lazy(
  () => import("./pages/admindashboard/Warehouse")
);

const VendorManagement = lazy(
  () => import("./pages/admindashboard/VendorManagement")
);
const PurchaseManagement = lazy(
  () => import("./pages/admindashboard/PurchaseManagement")
);

const ReceivedOrders = lazy(
  () => import("./pages/admindashboard/ReceivedOrders")
);

const OrderDashboard = lazy(
  () => import("./pages/admindashboard/OrderDashboard")
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
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
        <Route
          path="update-product"
          element={
            <Suspense fallback={<Loader />}>
              <ProductUpdate />
            </Suspense>
          }
        />
        <Route
          path="category"
          element={
            <Suspense fallback={<Loader />}>
              <CategoryPage />
            </Suspense>
          }
        />
        <Route
          path="warehouse"
          element={
            <Suspense fallback={<Loader />}>
              <WarehouseComponent />
            </Suspense>
          }
        />
        <Route
          path="vendor"
          element={
            <Suspense fallback={<Loader />}>
              <VendorManagement />
            </Suspense>
          }
        />
        <Route
          path="purchase"
          element={
            <Suspense fallback={<Loader />}>
              <PurchaseManagement />
            </Suspense>
          }
        />
        <Route
          path="receivedorder"
          element={
            <Suspense fallback={<Loader />}>
              <ReceivedOrders />
            </Suspense>
          }
        />
        <Route
          path="orders"
          element={
            <Suspense fallback={<Loader />}>
              <OrderDashboard />
            </Suspense>
          }
        />
      </Route>
    </>
  )
);

const App = () => <RouterProvider router={router} />;

export default App;
