import { NavLink } from "react-router-dom";
import { ExternalLink, LayoutDashboard, Users } from "lucide-react";
import { AUTH_STUDIO_URL } from "../lib/http-client";

export default function Sidebar() {
  return (
    <aside className="w-full border-r md:w-64 border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <nav className="p-3 md:p-4">
        <ul className="flex gap-2 md:flex-col">
          <li className="flex-1 md:flex-none">
            <NavLink
              to="/users-custom"
              className={({ isActive }) =>
                `inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              users-custom
            </NavLink>
          </li>

          <li className="flex-1 md:flex-none">
            <a
              href={AUTH_STUDIO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[hsl(var(--foreground))] transition hover:bg-[hsl(var(--accent))]"
            >
              <Users className="w-4 h-4" />
              users
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
