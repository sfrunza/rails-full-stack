import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  FileTextIcon,
  HistoryIcon,
  LayoutPanelLeftIcon,
  MailIcon,
  PhoneIcon,
  SettingsIcon,
  UmbrellaIcon,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from '@/store';
import JobsMenu from './JobsMenu';

export default function SideBar({ requests }: { requests: any[] }) {
  const { user } = useSelector((state) => state.auth);
  const { pathname } = useLocation();

  return (
    <Card className="relative">
      <CardHeader className="border-b p-4">
        <CardTitle className="rounded-md bg-slate-100 p-6">
          Welcome, {user?.first_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-4 pt-4">
        <Button
          variant="ghost"
          className={cn(
            'justify-start',
            pathname === '/account' && 'bg-slate-100'
          )}
          asChild
        >
          <Link to="/account">
            <LayoutPanelLeftIcon className="mr-4 size-4" />
            Account Overview
          </Link>
        </Button>
        <Accordion type="single" collapsible className="w-full border-none">
          <AccordionItem value="1" className="border-b-0">
            <AccordionTrigger
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'justify-between hover:no-underline'
              )}
            >
              <span className="flex items-center justify-start">
                <HistoryIcon className="mr-4 size-4" />
                My Moves History ({requests?.length})
              </span>
            </AccordionTrigger>
            <JobsMenu requests={requests} />
          </AccordionItem>
        </Accordion>
        <Separator />
        <Button
          variant="ghost"
          className={cn(
            'justify-start',
            pathname === '/account/profile' && 'bg-slate-100'
          )}
          asChild
        >
          <Link to="/account/profile">
            <SettingsIcon className="mr-4 size-4" /> Edit Profile
          </Link>
        </Button>
        <Separator />
        <Button variant="ghost" className="justify-start" asChild>
          <a href="#">
            <UmbrellaIcon className="mr-4 size-4" />
            <span className="truncate">Certificate of Insurance</span>
          </a>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
          <a href="#">
            <FileTextIcon className="mr-4 size-4" /> Bill of Lading
          </a>
        </Button>
        <Separator />
        <p className="pl-4 text-sm font-semibold">Need Help?</p>
        <Button variant="ghost" className="justify-start" asChild>
          <a href="tel:(617)9913552">
            <PhoneIcon className="mr-4 size-4" /> (617) 991-3552
          </a>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
          <a href="mailto:info@bravemovers.com">
            <MailIcon className="mr-4 size-4" />
            <span className="truncate">info@bravemovers.com</span>
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
