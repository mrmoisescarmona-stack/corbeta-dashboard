import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";

import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  Settings,
  ShieldCheck,
  Bell,
  Search,
  Menu,
  ChevronDown,
  ChevronRight,
  LogOut,
  Flag,
  Database,
  Building2,
  Headphones,
  Users,
  Tags,
  
  FileText,
  
  ShieldAlert,
  Workflow as WorkflowIcon,
} from "lucide-react";

import logoColor from "@/assets/corbeta_color.png.asset.json";
import logoWhite from "@/assets/corbeta_white.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth, getRoleLabel, getUserDisplayName, getUserEmail, getUserInitials, getAllDemoProfiles, setImpersonatedLogin, type AppRole } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Check, UserCircle2 } from "lucide-react";
import { canAccessRoute } from "@/lib/rbac";
import { ThemeToggle } from "@/components/theme-toggle";


export const Route = createFileRoute("/panel")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: DashboardLayout,
});

type NavItem = { icon: any; label: string; to: string; exact?: boolean; roles: AppRole[]; children?: NavItem[] };
type NavGroup = { title: string; items: NavItem[] };

const ALL: AppRole[] = ["supervisor", "aprobador", "proveedor", "administrador"];

const navGroups: NavGroup[] = [
  {
    title: "General",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", to: "/panel", exact: true, roles: ALL },
      { icon: Inbox, label: "Solicitudes", to: "/panel/solicitudes", roles: ["supervisor", "administrador"] },
      { icon: Inbox, label: "Solicitudes", to: "/panel/mis-solicitudes", roles: ["aprobador", "proveedor"] },

      
      { icon: WorkflowIcon, label: "Workflow", to: "/panel/workflow", roles: ["supervisor", "administrador"] },
      { icon: BarChart3, label: "Reportes", to: "/panel/reportes", roles: ["supervisor", "aprobador", "administrador"] },
    ],
  },
  {
    title: "Admin",
    items: [
      { icon: Tags, label: "Categorias de Productos", to: "/panel/aprobadores", roles: ["supervisor", "administrador"] },
      { icon: Users, label: "Proveedores", to: "/panel/proveedores", roles: ["supervisor", "administrador"] },
      {
        icon: Headphones,
        label: "Soporte",
        to: "/panel/soporte",
        roles: ["supervisor", "administrador"],
        children: [
          { icon: Bell, label: "Notificaciones", to: "/panel/notificaciones", roles: ["supervisor", "administrador"] },
          { icon: ShieldCheck, label: "Auditoría", to: "/panel/auditoria", roles: ["supervisor", "administrador"] },
        ],

      },
      { icon: Settings, label: "Configuración", to: "/panel/configuracion", roles: ["supervisor", "administrador"] },
    ],
  },
];


function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const auth = useAuth();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});


  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    navigate({ to: "/login" });
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const userRoles = auth.roles;
  const hasAccess = userRoles.length === 0 || canAccessRoute(pathname, userRoles);

  // Filter nav items by current user roles (administrador sees everything).
  // While auth is loading, show all items so the menu doesn't flash empty.
  const roleVisible = (item: NavItem) =>
    auth.loading ||
    userRoles.length === 0 ||
    userRoles.includes("administrador") ||
    item.roles.some((r) => userRoles.includes(r));

  const visibleGroups = navGroups
    .map((g) => {
      const filtered = g.items.filter(roleVisible).map((item) =>
        item.children ? { ...item, children: item.children.filter(roleVisible) } : item
      );
      // Deduplicate by label
      const seen = new Map<string, typeof filtered[number]>();
      for (const item of filtered) {
        const existing = seen.get(item.label);
        const matchesRole = item.roles.some((r) => userRoles.includes(r));
        if (!existing || (matchesRole && !existing.roles.some((r) => userRoles.includes(r)))) {
          seen.set(item.label, item);
        }
      }
      return { ...g, items: Array.from(seen.values()) };
    })
    .filter((g) => g.items.length > 0);



  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <aside className="hidden md:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
          <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
            <img src={logoColor.url} alt="Corbeta" className="h-7 w-auto block dark:hidden" />
            <img src={logoWhite.url} alt="Corbeta" className="h-7 w-auto hidden dark:block" />
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
            {visibleGroups.map((group) => (
              <div key={group.title} className="space-y-0.5">
                <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.to, item.exact);
                  const hasChildren = !!item.children?.length;
                  const childActive = hasChildren && item.children!.some((c) => isActive(c.to, c.exact));
                  const isOpen = openMenus[item.label] ?? (active || childActive);
                  if (hasChildren) {
                    return (
                      <div key={item.label} className="space-y-0.5">
                        <button
                          type="button"
                          onClick={() => setOpenMenus((m) => ({ ...m, [item.label]: !isOpen }))}
                          className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            active || childActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                          }`}
                          aria-expanded={isOpen}
                        >
                          <Icon className={`h-4 w-4 ${active || childActive ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isOpen && (
                          <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                            <Link
                              to={item.to}
                              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                active
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                              }`}
                            >
                              <LayoutDashboard className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                              <span className="flex-1 text-left">Panel de Soporte</span>
                            </Link>
                            {item.children!.map((child) => {
                              const ChildIcon = child.icon;
                              const childIsActive = isActive(child.to, child.exact);
                              return (
                                <Link
                                  key={child.label}
                                  to={child.to}
                                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    childIsActive
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                      : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                                  }`}
                                >
                                  <ChildIcon className={`h-4 w-4 ${childIsActive ? "text-primary" : "text-muted-foreground"}`} />
                                  <span className="flex-1 text-left">{child.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    );
                  }
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
          <div className="px-4 py-4 border-t border-sidebar-border space-y-3">
            <ThemeToggle />
            <div>
              <div className="text-xs font-medium text-foreground">Corbeta S.A.</div>
              <div className="text-[11px] text-muted-foreground">Versión 1.0.0</div>
            </div>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-lg border border-border bg-card pl-1 pr-3 py-1 hover:bg-accent transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                      {getUserInitials(auth.user)}
                    </div>
                    <div className="hidden sm:block leading-tight text-left">
                      <div className="text-xs font-semibold">{getUserDisplayName(auth.user)}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {getRoleLabel(auth.primaryRole)}
                        {` · ${getUserEmail(auth.user)}`}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                    <div className="leading-tight">
                      <div className="text-sm font-semibold">{getUserDisplayName(auth.user)}</div>
                      <div className="text-[11px] font-normal text-muted-foreground">
                        {getRoleLabel(auth.primaryRole)}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(() => {
                    const isAdmin = auth.realPrimaryRole === "administrador";
                    const currentLogin = auth.user?.email?.toLowerCase() ?? "";
                    const profiles = isAdmin
                      ? getAllDemoProfiles()
                      : getAllDemoProfiles().filter(
                          (p) => p.loginEmail.toLowerCase() === (auth.realUserEmail ?? "").toLowerCase()
                        );
                    return (
                      <>
                        <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {isAdmin ? "Cambiar de cuenta" : "Cuenta"}
                        </DropdownMenuLabel>
                        {profiles.map((p) => {
                          const active = p.loginEmail.toLowerCase() === currentLogin;
                          return (
                            <DropdownMenuItem
                              key={p.loginEmail}
                              onClick={() => {
                                if (active) return;
                                const realLogin = (auth.realUserEmail ?? "").toLowerCase();
                                setImpersonatedLogin(
                                  p.loginEmail.toLowerCase() === realLogin ? null : p.loginEmail
                                );
                                toast.success(`Visualizando como ${p.name}`);
                              }}
                              className="flex items-start gap-3 py-2"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-semibold">
                                {p.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                              </div>
                              <div className="flex-1 min-w-0 leading-tight">
                                <div className="text-xs font-semibold truncate">{p.name}</div>
                                <div className="text-[11px] text-muted-foreground truncate">
                                  {getRoleLabel(p.role)} · {p.email}
                                </div>
                              </div>
                              {active && <Check className="h-4 w-4 text-primary shrink-0 mt-1" />}
                            </DropdownMenuItem>
                          );
                        })}
                        {auth.impersonating && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setImpersonatedLogin(null);
                                toast.success("Volviendo a tu cuenta");
                              }}
                              className="text-xs"
                            >
                              Volver a mi cuenta
                            </DropdownMenuItem>
                          </>
                        )}
                      </>
                    );
                  })()}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-xs">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            {auth.loading ? (
              <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
                Cargando…
              </div>
            ) : !hasAccess ? (
              <AccessDenied role={auth.primaryRole} />
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function AccessDenied({ role }: { role: AppRole | null }) {
  return (
    <div className="mx-auto max-w-md text-center py-20">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-semibold text-foreground">Acceso no autorizado</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tu rol actual ({getRoleLabel(role)}) no tiene permisos para acceder a esta sección.
      </p>
      <Link
        to="/panel"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Volver al Dashboard
      </Link>
    </div>
  );
}
