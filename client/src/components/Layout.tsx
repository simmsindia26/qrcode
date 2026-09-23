import {
  LogOut,
  Plus,
  QrCode,
  LayoutDashboard,
  ScanLine,
} from "lucide-react";

import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");

  const user = userString
    ? JSON.parse(userString)
    : null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const navClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
        : "text-gray-600 hover:bg-red-50 hover:text-red-600"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 bottom-0 z-40 flex flex-col">

        {/* =================================================
            LOGO / BRAND
        ================================================== */}

        <div className="p-5">

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >

            {/* Logo */}

            <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">

              <div className="relative">

                <QrCode
                  size={25}
                  strokeWidth={2.5}
                  className="text-white"
                />

                <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">

                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />

                </div>

              </div>

            </div>

            {/* Brand */}

            <div>

              <h1 className="text-lg font-bold tracking-tight text-red-900">
                Sellopedia QR Tracker
              </h1>

              <p className="text-[11px] text-gray-400 font-medium">
                QR Management
              </p>

            </div>

          </Link>

        </div>


        {/* =================================================
            RED BRAND LINE
        ================================================== */}

        <div className="px-5 mb-5">

          <div className="h-1 w-12 bg-red-600 rounded-full" />

        </div>


        {/* =================================================
            NAVIGATION
        ================================================== */}

        <nav className="px-4 space-y-2">

          <p className="px-4 mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>


          {/* Dashboard */}

          <NavLink
            to="/dashboard"
            className={navClass}
          >

            <LayoutDashboard
              size={18}
              strokeWidth={2}
            />

            <span className="text-sm font-medium">
              Dashboard
            </span>

          </NavLink>


          {/* Generated QR */}

          <NavLink
            to="/qr"
            end
            className={navClass}
          >

            <QrCode
              size={18}
              strokeWidth={2}
            />

            <span className="text-sm font-medium">
              Generated QR
            </span>

          </NavLink>


          {/* Create QR */}

          <NavLink
            to="/qr/create"
            className={navClass}
          >

            <Plus
              size={18}
              strokeWidth={2}
            />

            <span className="text-sm font-medium">
              Create QR
            </span>

          </NavLink>

        </nav>


        {/* =================================================
            QUICK INFO
        ================================================== */}

        <div className="mt-auto px-4 mb-4">

          <div className="rounded-2xl bg-red-50 border border-red-100 p-4">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center">

                <ScanLine
                  size={18}
                  className="text-white"
                />

              </div>

              <div>

                <p className="text-xs font-semibold text-red-700">
                  QR Tracking
                </p>

                <p className="text-[10px] text-red-500 mt-0.5">
                  Track every scan
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            USER / LOGOUT
        ================================================== */}

        <div className="p-4 border-t border-gray-200">

          {user && (
            <div className="mb-3 px-2">

              <div className="flex items-center gap-3">

                {/* Avatar */}

                <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">

                  {user.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}

                </div>


                {/* User Info */}

                <div className="min-w-0">

                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {user.name}
                  </p>

                  <p className="text-xs text-gray-400 truncate">
                    @{user.userId}
                  </p>

                </div>

              </div>

            </div>
          )}


          {/* Logout */}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >

            <LogOut size={18} />

            <span className="text-sm font-medium">
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="ml-64 flex-1 min-h-screen">

        {/* Top red accent */}

        <div className="h-1 bg-red-600" />

        <div className="max-w-7xl mx-auto px-8 py-8">

          <Outlet />

        </div>

      </main>

    </div>
  );
}