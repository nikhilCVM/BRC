import { NavLink, Outlet } from "react-router-dom";
import { getAuthState, logout } from "../utils/auth";

const AppLayout = () => {
  const { isLoggedIn, isAdmin } = getAuthState();

  const handleLogout = () => {
    logout();
    window.location.href = "/members";
  };

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/brc-senior-citizens-logo.png"
              alt="BRC Senior Citizens logo"
              className="h-14 w-14 rounded-full border border-gray-200 bg-white object-cover shadow-sm"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                BRC Siva Hills Senior Citizens
              </h1>
              <p className="text-sm text-gray-500">Manage member records</p>
            </div>
          </div>

          <nav className="flex gap-2">
            <NavLink to="/" className={linkClass}>
              Members
            </NavLink>
            {isAdmin && (
              <NavLink to="/members/add" className={linkClass}>
                Add Member
              </NavLink>
            )}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Logout
              </button>
            ) : (
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
