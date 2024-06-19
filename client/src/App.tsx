import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "@/components/PublicRoute";
import CustomerLayout from "@/layouts/customer/CustomerLayout";
import MainLayout from "@/layouts/MainLayout";
import RequestLayout from "@/layouts/RequestLayout";
import AdminLayout from "@/layouts/admin/AdminLayout";

import AdminLogin from "@/pages/AdminLogin";
import Home from "@/pages/Home";

import Requests from "@/pages/crm/requests/Requests";
import Request from "@/pages/crm/request/Request";
import Calendar from "@/pages/crm/Calendar";
import SettingsMain from "@/pages/crm/settings/SettingsMain";
import ServicesSettings from "@/pages/crm/settings/services/ServicesSettings";
import PackingSettings from "@/pages/crm/settings/packing/PackingSettings";

import Profile from "@/pages/account/Profile";
import AccountMain from "@/pages/account/AccountMain";
import AccountRequest from "@/pages/account/request/AccountRequest";
import BookPage from "@/pages/BookPage";
import Messages from "@/pages/crm/Messages";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/book" element={<BookPage />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/crm/requests" element={<Requests />} />
        <Route path="/crm/calendar" element={<Calendar />} />
        <Route path="/crm/messages" element={<Messages />} />
        <Route element={<SettingsMain />}>
          <Route path="/crm/settings" element={<div className="hidden" />} />
          <Route path="/crm/settings/services" element={<ServicesSettings />} />
          <Route path="/crm/settings/packing" element={<PackingSettings />} />
        </Route>
        <Route path="/crm" element={<Navigate to="/crm/requests" />} />
      </Route>

      <Route element={<RequestLayout />}>
        <Route path="/crm/requests/:id" element={<Request />} />
      </Route>

      <Route element={<CustomerLayout />}>
        <Route path="/account" element={<AccountMain />} />
        <Route path="/account/profile" element={<Profile />} />
        <Route path="/account/requests" element={<Navigate to="/account" />} />
        <Route path="/account/requests/:id" element={<AccountRequest />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<AdminLogin />} />
      </Route>

      {/* catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
