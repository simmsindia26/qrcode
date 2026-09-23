import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import CreateQR from "./pages/CreateQR";
import QRList from "./pages/QRList";
import QRDetails from "./pages/QRDetails";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* PROTECTED */}

        <Route element={<ProtectedRoute />}>

          <Route element={<Layout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* QR GENERATOR */}

            <Route
              path="/qr/create"
              element={<CreateQR />}
            />


            {/* GENERATED QR LIST */}

            <Route
              path="/qr"
              element={<QRList />}
            />


            {/* INDIVIDUAL QR */}

            <Route
              path="/qr/:id"
              element={<QRDetails />}
            />

          </Route>

        </Route>


        {/* DEFAULT */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}