import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import { navLinks } from './navLinks';
import { Link, useLocation } from 'react-router-dom';

export function MobileMenu() {
  const { pathname } = useLocation();
  return (
    <Sheet>
      <SheetTrigger asChild className="flex lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="border-none bg-transparent p-0 shadow-none hover:bg-slate-100/10"
        >
          <MenuIcon className="h-5 w-5 rounded-md text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div>
          <ul role="list" className="flex flex-col items-start space-y-2">
            {navLinks.map((item, i) => {
              const active = item.href === pathname;

              return (
                <li key={i}>
                  <SheetClose asChild>
                    <Link to={item.href}>
                      <Button
                        variant={active ? 'secondary' : 'ghost'}
                        className="rounded-full py-6"
                      >
                        <item.icon className="mr-4 size-5" aria-hidden="true" />
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
