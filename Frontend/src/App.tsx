import { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import LandingPage from "./pages/LandingPage";
import Loader from "./component/Loader";
import { Toaster } from "react-hot-toast";

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
  () => import("./pages/admindashboard/WarehouseComponent")
);

// const Warehouse = lazy(() => import("./pages/admindashboard/Warehouse"));

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
const DashboardReport = lazy(
  () => import("./pages/admindashboard/DashboardReport")
);
const DashboardData = lazy(
  () => import("./pages/admindashboard/DashboardData")
);
const WarehousePage = lazy(
  () => import("./pages/admindashboard/WarehousePage")
);
const UserDashboard = lazy(() => import("./pages/userDashboard/UserDashboard"));
const UserLayout = lazy(() => import("./layouts/userLayouts/userLayout"));
const SingleProduct = lazy(() => import("./pages/userDashboard/SingleProduct"));
const Cart = lazy(() => import("./pages/userDashboard/Cart"));
const Checkout = lazy(() => import("./pages/userDashboard/Checkout"));
const CheckoutSuccessPage = lazy(
  () => import("./pages/userDashboard/CheckoutSuccessPage")
);
const CheckoutCancel = lazy(
  () => import("./pages/userDashboard/CheckoutCancel")
);

const DeliverOrder = lazy(() => import("./pages/admindashboard/DeliverOrder"));
const DeliverOrderEmp = lazy(
  () => import("./pages/employeeDashboard/DeliverOrderEmp")
);

const OrderDashboardEmp = lazy(
  () => import("./pages/employeeDashboard/OrderDashboardEmp")
);

const OrderHistroy = lazy(() => import("./pages/userDashboard/orderHistroy"));

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
        <Route
          path="/explore"
          element={
            <Suspense fallback={<Loader />}>
              <UserDashboard />
            </Suspense>
          }
        />
        {/* <Route
          path="/explore"
          element={
            <Suspense fallback={<Loader />}>
              <UserDashboard />
            </Suspense>
          }
        /> */}
      </Route>

      {/* Protected Routes For Admin */}
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

        <Route
          path="orderscompleted"
          element={
            <Suspense fallback={<Loader />}>
              <OrderDashboardEmp />
            </Suspense>
          }
        />
        <Route
          path="reports"
          element={
            <Suspense fallback={<Loader />}>
              <DashboardReport />
            </Suspense>
          }
        />
        <Route
          path="data"
          element={
            <Suspense fallback={<Loader />}>
              <DashboardData />
            </Suspense>
          }
        />
        <Route
          path="warehouse1"
          element={
            <Suspense fallback={<Loader />}>
              <WarehouseComponent />
            </Suspense>
          }
        />
        <Route
          path="createwarehouse"
          element={
            <Suspense fallback={<Loader />}>
              <WarehousePage />
            </Suspense>
          }
        />
        <Route
          path="deliverorder"
          element={
            <Suspense fallback={<Loader />}>
              <DeliverOrder />
            </Suspense>
          }
        />
        <Route
          path="deliverorderbymployee"
          element={
            <Suspense fallback={<Loader />}>
              <DeliverOrderEmp />
            </Suspense>
          }
        />
      </Route>

      {/* Protected Routes For User */}
      <Route
        path="/user"
        element={
          <Suspense fallback={<Loader />}>
            <UserLayout />
          </Suspense>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<Loader />}>
              <UserDashboard />
            </Suspense>
          }
        />
        <Route
          path="product/:productId"
          element={
            <Suspense fallback={<Loader />}>
              <SingleProduct />
            </Suspense>
          }
        />
        <Route
          path="cart"
          element={
            <Suspense fallback={<Loader />}>
              <Cart />
            </Suspense>
          }
        />
        <Route
          path="orderhistroy"
          element={
            <Suspense fallback={<Loader />}>
              <OrderHistroy />
            </Suspense>
          }
        />
        <Route
          path="checkout"
          element={
            <Suspense fallback={<Loader />}>
              <Checkout />
            </Suspense>
          }
        />
        <Route
          path="checkout/success"
          element={
            <Suspense fallback={<Loader />}>
              <CheckoutSuccessPage />
            </Suspense>
          }
        />
        <Route
          path="checkout/cancel"
          element={
            <Suspense fallback={<Loader />}>
              <CheckoutCancel />
            </Suspense>
          }
        />
      </Route>
    </>
  )
);
const App = () => (
  <>
    <Toaster position="top-right" reverseOrder={false} />
    <RouterProvider router={router} />
  </>
);
export default App;
