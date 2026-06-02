import { NavLink, Outlet } from "react-router-dom";

const AppLayout = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = Boolean(token) && role === "admin";

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
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Member Bio Data System
            </h1>
            <p className="text-sm text-gray-500">Manage member records</p>
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
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
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
