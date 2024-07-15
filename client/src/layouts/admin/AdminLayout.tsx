import logo from "@/assets/logos/mono-logo.png";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "@/store";
import { CreateRequestButton } from "./_components/CreateRequestButton";
import { MobileMenu } from "./_components/MobileMenu";
import SideBar from "./_components/SideBar";
import UserButton from "./_components/UserButton";
import { Button } from "@/components/ui/button";
import { MessageCircleMore } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const isMessagesPage = "/crm/messages" === location.pathname;

  if (!localStorage.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role !== "admin") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="fixed h-full w-full overflow-hidden bg-slate-900">
      <header className="sticky z-30 w-full">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="hidden max-w-[8rem] lg:block">
              <img src={logo} alt="logo" />
            </div>
            <MobileMenu />
            <CreateRequestButton />
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <Button
              asChild
              size="icon"
              variant={isMessagesPage ? "outline" : "ghost"}
              className={cn(
                "size-10 rounded-[36%]",
                !isMessagesPage && "text-white",
              )}
            >
              <Link to="/crm/messages">
                <div className="relative">
                  <MessageCircleMore className="size-8" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-600 p-2 text-xs text-white">
                    2
                  </span>
                </div>
              </Link>
            </Button>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="flex h-full">
        <div className="hidden lg:left-0 lg:z-20 lg:block lg:min-w-16 lg:bg-slate-900 lg:pb-4">
          <SideBar />
        </div>
        <div className="h-[calc(100%-64px)] w-full overflow-y-auto overflow-x-hidden rounded-none bg-muted p-2 lg:w-[calc(100%-4rem)] lg:rounded-tl-2xl lg:p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
