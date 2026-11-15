import {
  CalendarDays,
  FolderOpen,
  House,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  enabled: boolean;
  exact?: boolean;
};

export const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "الرئيسية",
    icon: House,
    enabled: true,
    exact: true,
  },
  { href: "/dashboard/clients", label: "العملاء", icon: Users, enabled: true },
  {
    href: "/dashboard/cases",
    label: "القضايا",
    icon: FolderOpen,
    enabled: true,
  },
  {
    href: "/dashboard/hearings",
    label: "الجلسات والمواعيد",
    icon: CalendarDays,
    enabled: false,
  },
  { href: "/dashboard/fees", label: "الأتعاب", icon: Wallet, enabled: false },
  {
    href: "/dashboard/settings",
    label: "الإعدادات",
    icon: Settings,
    enabled: true,
  },
];
