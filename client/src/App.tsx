import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import PublicLayout from "./layout/public";
import Login from "./pages/auth/login";
import NotFound from "./pages/NotFound";
import { publicRouter } from "./routers/public.router";
import { store } from "./store/store";
import { ToastContainer } from "react-toastify";
import DashboardLayout from "./layout/admin";
import { adminRouter } from "./routers/admin.router";
import { injectStore } from "./services/axios.customize";
import CreateOrder from "./pages/admin/order/create.order";

const persistor = persistStore(store);

// Inject store into axios
injectStore(store);

const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <TooltipProvider>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path="/dang-nhap" element={<Login />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/orders/new" element={<CreateOrder />} />

            <Route element={<PublicLayout />}>
              {publicRouter.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))
              }
            </Route>

            <Route element={<DashboardLayout />}>
              {adminRouter.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))
              }
            </Route>

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PersistGate>
  </Provider>
);

export default App;
