"use client";
import { navItems } from "./navItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();
  return (
    <nav className="flex-col-start gap-2 w-full">
      {navItems
        .filter((item) => item.enabled)
        .map(({ exact, href, label, icon: Icon }) => {
          const active = exact ? href === pathname : pathname.startsWith(href);
          return (
            <Link
              key={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex-start gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors w-full",
                active
                  ? "bg-accent/15 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
              href={href}
            >
              <Icon className="size-5" /> {label}
            </Link>
          );
        })}
    </nav>
  );
};

export default NavLinks;
