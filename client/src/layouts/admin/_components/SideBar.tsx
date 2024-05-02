import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { navLinks } from "./navLinks";
import { Link, useLocation } from "react-router-dom";

export default function SideBar() {
  const { pathname } = useLocation();

  return (
    <nav className="mt-6">
      <ul role="list" className="flex flex-col items-center space-y-4">
        {navLinks.map((item, i) => {
          const active = item.href === pathname;

          return (
            <li key={i}>
              <Link to={item.href}>
                <Button
                  size="icon"
                  variant={active ? "outline" : "ghost"}
                  className={cn(
                    "size-10 rounded-[36%]",
                    item.href !== pathname && "text-white",
                  )}
                >
                  <item.icon className="size-5" aria-hidden="true" />
                </Button>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
