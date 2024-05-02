import {
  FileTextIcon,
  HistoryIcon,
  LayoutPanelLeftIcon,
  MailIcon,
  MenuIcon,
  MoveRightIcon,
  PhoneIcon,
  SettingsIcon,
  UmbrellaIcon,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSelector } from "@/store";

const statusColors = {
  Pending: "text-amber-500 bg-amber-100",
  Confirmed: "text-green-600 bg-green-100",
  "Not Confirmed": "text-indigo-600 bg-indigo-100",
  Canceled: "text-red-500 bg-red-100",
  Completed: "text-[deepskyblue] bg-sky-100",
  "Not Available": "text-slate-800 bg-slate-200",
  Expired: "text-slate-800 bg-slate-200",
  Spam: "text-slate-800 bg-slate-200",
};

export function SideBarMobile({ requests }: { requests: any[] }) {
  const { user } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const params = useParams<{ id: string }>();

  const iconClassName = "mr-4 size-4";

  return (
    <Sheet>
      <SheetTrigger asChild className="flex lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="border-none bg-transparent p-0 shadow-none hover:bg-muted/10 "
        >
          <MenuIcon className="h-5 w-5 rounded-md text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col gap-2 overflow-y-scroll px-4 pt-10"
      >
        <SheetHeader>
          <h2 className="text-lg font-semibold">Welcome, {user?.first_name}</h2>
        </SheetHeader>
        <Button
          variant="ghost"
          className={cn("justify-start", pathname === "/account" && "bg-muted")}
          asChild
        >
          <SheetClose asChild>
            <Link to="/account">
              <LayoutPanelLeftIcon className={iconClassName} />
              Account Overview
            </Link>
          </SheetClose>
        </Button>
        <Accordion type="single" collapsible className="w-full border-none">
          <AccordionItem value="1" className="border-b-0">
            <AccordionTrigger
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-between hover:no-underline",
              )}
            >
              <span className="flex items-center justify-start">
                <HistoryIcon className={iconClassName} />
                My Moves History ({requests.length})
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 border-none px-1 pt-4">
              {requests.map((job) => (
                <SheetClose asChild key={job.id}>
                  <Link
                    to={`account/requests/${job.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      params.id === job.id.toString() && "bg-muted",
                      "flex h-fit flex-col gap-1 p-2 text-xs",
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <p className="font-semibold"># {job.id}</p>
                      <p
                        className={cn(
                          `w-fit rounded-full px-2 py-1 ${
                            statusColors[
                              job.status as keyof typeof statusColors
                            ]
                          } `,
                        )}
                      >
                        {job.status}
                      </p>
                    </div>
                    <div className="flex w-full items-center gap-2 overflow-hidden text-muted-foreground">
                      {origin && (
                        <p>
                          {job.origin.city}, {job.origin.state}
                        </p>
                      )}
                      {job.origin && job.destination && (
                        <MoveRightIcon className="size-4 min-w-4" />
                      )}
                      {job.destination && (
                        <p>
                          {job.destination.city}, {job.destination.state}
                        </p>
                      )}
                    </div>
                  </Link>
                </SheetClose>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Separator />
        <Button
          variant="ghost"
          className={cn(
            "justify-start",
            pathname === "/account/profile" && "bg-muted",
          )}
          asChild
        >
          <SheetClose asChild>
            <Link to="/account/profile">
              <SettingsIcon className={iconClassName} /> Edit Profile
            </Link>
          </SheetClose>
        </Button>
        <Separator />
        <Button variant="ghost" className="justify-start" asChild>
          <a href="#">
            <UmbrellaIcon className={iconClassName} /> Certificate of Insurance
          </a>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
          <a href="#">
            <FileTextIcon className={iconClassName} /> Bill of Lading
          </a>
        </Button>
        <Separator />
        <p className="pl-4 text-sm font-semibold">Need Help?</p>
        <Button variant="ghost" className="justify-start" asChild>
          <a href="tel:(617)9913552">
            <PhoneIcon className={iconClassName} /> (617) 991-3552
          </a>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
          <a href="mailto:info@bravemovers.com">
            <MailIcon className={iconClassName} /> info@bravemovers.com
          </a>
        </Button>
      </SheetContent>
    </Sheet>
  );
}
