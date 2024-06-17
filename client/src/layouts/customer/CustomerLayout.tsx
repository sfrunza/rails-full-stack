import logo from "@/assets/logos/mono-logo.png";
import FormSubmitButton from "@/components/FormSubmitButton";
import useAuth from "@/hooks/useAuth";
import { LogOutIcon } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useSWR from "swr";
import SideBar from "./_components/SideBar";
import { SideBarMobile } from "./_components/SideBarMobile";

export default function CustomerLayout() {
  let location = useLocation();
  const { user, isLoading, logout } = useAuth();

  const { data } = useSWR(user ? `/client_requests` : null);

  if (!localStorage.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role !== "customer") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="from min-h-screen bg-muted">
      <header className="h-48 bg-slate-900 lg:h-56">
        <nav className="container flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
          <ul className="flex w-full items-center justify-between text-sm font-medium">
            <SideBarMobile requests={data || []} />
            <li>
              <div className="hidden max-w-[10rem] lg:block">
                <img src={logo} alt="logo" />
              </div>
            </li>

            <div className="flex items-center gap-4">
              <li>
                <a href="#" className="text-muted">
                  About us
                </a>
              </li>
              <li>
                <FormSubmitButton
                  variant="ghost"
                  type="button"
                  size="sm"
                  className="flex cursor-pointer items-center text-muted"
                  onClick={logout}
                  disabled={isLoading}
                  isPending={isLoading}
                  label={
                    <>
                      {!isLoading && <LogOutIcon className="mr-2 size-4" />}
                      Log out
                    </>
                  }
                />
              </li>
            </div>
          </ul>
        </nav>
      </header>

      <main className="-mt-28">
        <div className="mx-auto max-w-6xl p-2 md:p-4">
          <div className="grid grid-cols-12 gap-6">
            <aside className="col-span-12 hidden lg:col-span-3 lg:block">
              <SideBar requests={data || []} />
              <p className="p-4 text-xs text-muted-foreground">
                © Copyright <br />
                Brave Movers is fully licensed, bonded and insured moving
                company.
                <br />
                We carry general liability, cargo and workers&apos;
                compensation.
                <br />
                <br />
                USDOT # 3791733 | MC# 1361288.
                <br />
                <br />
                Brave Movers. All rights reserved
              </p>
            </aside>

            <div className="col-span-12 lg:col-span-9">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
