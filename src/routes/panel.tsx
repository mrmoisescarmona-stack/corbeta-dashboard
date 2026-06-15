import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CheckSquare,
  Inbox,
  BarChart3,
  Settings,
  ShieldCheck,
  Bell,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  Mail,
  User,
  Flag,
  Database,
  Building2,
  Headphones,
} from "lucide-react";
import logoAsset from "@/assets/logo_corbeta.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/panel")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: DashboardLayout,
});

type NavItem = { icon: any; label: string; to: string; exact?: boolean };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: "General",
    items: [
      { icon: LayoutDashboard, label: "Panel general", to: "/panel", exact: true },
      { icon: Inbox, label: "Workflow", to: "/panel/flujo" },
      { icon: BarChart3, label: "Reportes", to: "/panel/reportes" },
    ],
  },
  {
    title: "Admin",
    items: [
      { icon: Flag, label: "Seguimiento", to: "/panel/seguimiento" },
      { icon: Database, label: "Envío PeopleSoft", to: "/panel/peoplesoft" },
      { icon: Building2, label: "Proveedores", to: "/panel/proveedores" },
      { icon: Bell, label: "Notificaciones", to: "/panel/notificaciones" },
      { icon: ShieldCheck, label: "Auditoría", to: "/panel/auditoria" },
      { icon: Headphones, label: "Soporte", to: "/panel/soporte" },
      { icon: Settings, label: "Configuración", to: "/panel/configuracion" },
    ],
  },
];

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    navigate({ to: "/login" });
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <aside className="hidden md:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
          <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
            <img src={logoAsset.url} alt="Corbeta" className="h-6 w-auto" />
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-0.5">
                <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.to, item.exact);
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="px-6 py-4 border-t border-sidebar-border">
            <div className="text-xs font-medium text-foreground">Corbeta S.A.</div>
            <div className="text-[11px] text-muted-foreground">Versión 1.0.0</div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 md:px-8 backdrop-blur">
            <button className="md:hidden -ml-1 p-2 text-muted-foreground hover:text-foreground">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Buscar preorden, cliente o proveedor…"
                  className="w-full rounded-lg border border-input bg-card pl-9 pr-14 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-3">

              <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning text-[10px] font-semibold text-warning-foreground">
                  3
                </span>
              </button>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card pl-1 pr-3 py-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                  MC
                </div>
                <div className="hidden sm:block leading-tight">
                  <div className="text-xs font-semibold">Moises Carmona</div>
                  <div className="text-[11px] text-muted-foreground">
                    Supervisor
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </header>

          <main className="px-4 md:px-8 py-6 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
