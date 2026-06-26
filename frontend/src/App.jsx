import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import AppLayout from "./layouts/AppLayout";
import AddMemberPage from "./pages/AddMemberPage";
import Dashboard from "./pages/Dashboard";
import EditMemberPage from "./pages/EditMemberPage";
import LoginPage from "./pages/LoginPage";
import MemberDetailsPage from "./pages/MemberDetailsPage";
import SharedEditMember from "./components/SharedEditMember";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/members" element={<Dashboard />} />
          <Route path="/members/shared-edit/:token" element={<SharedEditMember />} />
          <Route path="/members/:id" element={<MemberDetailsPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/members/add" element={<AddMemberPage />} />
            <Route path="/members/:id/edit" element={<EditMemberPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
