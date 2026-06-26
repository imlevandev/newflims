"use client";

import type { SvgIconComponent } from "@mui/icons-material";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface WorkspaceNavProps {
  subtitle?: string;
  title: string;
  items: Array<{
    href: Route;
    icon: SvgIconComponent;
    label: string;
  }>;
}

export function WorkspaceNav({
  subtitle,
  title,
  items,
}: WorkspaceNavProps) {
  const pathname = usePathname();

  return (
    <aside className="workspace-nav admin-sidebar">
      <div className="admin-sidebar__brand">
        <span className="admin-sidebar__logo">CB</span>
        <div>
          <strong>{title}</strong>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>

      <div className="admin-sidebar__section-label">Điều hướng</div>

      <nav className="nav-list">
        {items.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              className={`nav-link ${isActive ? "is-active" : ""}`}
              href={item.href}
              key={item.href}
            >
              <item.icon sx={{ fontSize: 20 }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
