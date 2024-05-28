import { Outlet } from "react-router-dom";
import PageHeader from "@/components/PageHeader";

export default function MainLayout() {
  return (
    <div className="h-full min-h-screen">
      <PageHeader />
      <div className="flex h-full min-h-[calc(100vh-64px)] items-center justify-center bg-muted">
        <div className="h-full p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
