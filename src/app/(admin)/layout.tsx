import type { Route } from "next";
import type { ReactNode } from "react";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MovieRoundedIcon from "@mui/icons-material/MovieRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";

import { WorkspaceNav } from "@/components/navigation/workspace-nav";
import "@/features/admin-movies/admin.css";

const items = [
  { href: "/admin", icon: DashboardRoundedIcon, label: "Tổng quan" },
  { href: "/admin/users", icon: PeopleAltRoundedIcon, label: "Người dùng" },
  { href: "/admin/crawl", icon: MovieRoundedIcon, label: "Crawl phim" },
  { href: "/", icon: HomeRoundedIcon, label: "Về trang chủ" },
] satisfies Array<{
  href: Route;
  icon: typeof DashboardRoundedIcon;
  label: string;
}>;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="admin-shell">
      <div className="admin-layout">
        <WorkspaceNav
          items={items}
          subtitle="Quản trị hệ thống phim"
          title="CobePhim"
        />
        <div className="admin-layout__content">{children}</div>
      </div>
    </main>
  );
}
