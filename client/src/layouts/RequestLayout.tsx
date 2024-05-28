import { useSelector } from "@/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequestLayout() {
  let location = useLocation();
  const { user } = useSelector((state) => state.auth);

  if (!localStorage.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role !== "admin") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <main className="fixed left-0 top-0 h-full w-full bg-slate-900">
      <div className="hidden h-10 w-full bg-slate-900 md:block" />
      <div className="h-full w-full overflow-hidden overflow-y-scroll">
        <div className="m-auto min-h-screen max-w-[1300px] bg-background pb-8 md:min-h-[calc(100vh-40px)] md:rounded-t-lg">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
