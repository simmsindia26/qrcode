import { useState } from "react";
import type { FormEvent } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  QrCode,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  const handleLogin = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!login.trim() || !password) {
      setError(
        "Enter your User ID/email and password"
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          "/auth/login",
          {
            login: login.trim(),
            password,
          }
        );

      /*
      |--------------------------------------------------------------------------
      | Save Authentication
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      /*
      |--------------------------------------------------------------------------
      | Redirect
      |--------------------------------------------------------------------------
      */

      navigate("/dashboard");

    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="flex min-h-screen items-center justify-center px-4 py-10">

        <div className="w-full max-w-md">


          {/* =================================================
              LOGO
          ================================================== */}

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 shadow-xl shadow-red-600/20">

              <QrCode
                size={34}
                strokeWidth={2.2}
                className="text-white"
              />

            </div>


            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              QR Tracker
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to manage your QR codes
            </p>

          </div>


          {/* =================================================
              FORM CARD
          ================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">


            {/* HEADER */}

            <div className="mb-7">

              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter your account details to continue.
              </p>

            </div>


            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >


              {/* =================================================
                  USER ID / EMAIL
              ================================================== */}

              <div>

                <label
                  htmlFor="login"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  User ID or Email
                </label>


                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />


                  <input
                    id="login"
                    type="text"
                    value={login}
                    onChange={(e) =>
                      setLogin(
                        e.target.value
                      )
                    }
                    placeholder="Enter your User ID or email"
                    autoComplete="username"
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>


                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />


                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              {/* =================================================
                  ERROR
              ================================================== */}

              {error && (

                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3.5">

                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white">
                    !
                  </div>

                  <p className="text-sm leading-5 text-red-600">
                    {error}
                  </p>

                </div>

              )}


              {/* =================================================
                  LOGIN BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (

                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Logging in...
                  </>

                ) : (

                  <>
                    Login

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>

                )}

              </button>

            </form>


            {/* =================================================
                REGISTER
            ================================================== */}

            <div className="mt-7 border-t border-gray-100 pt-6">

              <p className="text-center text-sm text-gray-500">

                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="font-semibold text-red-600 transition hover:text-red-700"
                >
                  Create account
                </Link>

              </p>

            </div>

          </div>


          {/* =================================================
              FOOTER
          ================================================== */}

          <p className="mt-6 text-center text-xs text-gray-400">
            QR Tracker
          </p>

        </div>

      </div>

    </div>
  );
}