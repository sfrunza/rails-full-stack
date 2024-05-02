import {
  BarChart4Icon,
  CalendarDaysIcon,
  FileIcon,
  LayoutGridIcon,
  MenuIcon,
  SettingsIcon,
  TruckIcon,
} from "lucide-react";


export const navLinks = [
  { name: "Dashboard", href: "/crm/requests", icon: LayoutGridIcon },
  {
    name: "Calendar",
    href: "/crm/calendar",
    icon: CalendarDaysIcon,
  },
  { name: "Projects", href: "#", icon: TruckIcon },
  { name: "Settings", href: "/crm/settings", icon: SettingsIcon },
  { name: "Documents", href: "#", icon: FileIcon },
  { name: "Reports", href: "#", icon: BarChart4Icon },
];
