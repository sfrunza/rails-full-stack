import { cn } from "lib/utils";
import { DollarSignIcon, Package2Icon } from "lucide-react";

import { Button } from "components/ui/button";
import { TruckIcon } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

export const navLinks = [
  { name: "Services", href: "/crm/settings/services", icon: TruckIcon },

  {
    name: "Packing",
    href: "/crm/settings/packing",
    icon: Package2Icon,
  },
  {
    name: "Rates",
    href: "#",
    icon: DollarSignIcon,
  },
];

export default function SettingsMain() {
  const { pathname } = useLocation();
  return (
    <div className="grid min-h-full w-full rounded-lg md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div
        className={cn(
          "border-r",
          pathname === "/crm/settings" ? "block" : "hidden md:block",
        )}
      >
        <div className="flex h-full max-h-screen flex-col gap-2 md:w-full">
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <div>
                <ul
                  role="list"
                  className="flex flex-col items-start space-y-2 pt-4"
                >
                  {navLinks.map((item, i) => {
                    const active = item.href === pathname;

                    return (
                      <li key={i} className="w-full">
                        <Link to={item.href}>
                          <Button
                            variant={active ? "default" : "ghost"}
                            className="w-full justify-start py-6"
                          >
                            <item.icon
                              className="mr-4 size-5"
                              aria-hidden="true"
                            />
                            <span>{item.name}</span>
                          </Button>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "",
          pathname === "/crm/settings" ? "hidden" : "flex-col md:flex",
        )}
      >
        <main className="md:px-4 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
