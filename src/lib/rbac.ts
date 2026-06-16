import type { AppRole } from "@/hooks/use-auth";

/**
 * Map every panel route to the roles allowed to access it.
 * Administrador siempre tiene acceso a todo.
 */
export const ROUTE_PERMISSIONS: Record<string, AppRole[]> = {
  "/panel": ["supervisor", "aprobador", "proveedor", "administrador"], // dashboard
  "/panel/solicitudes": ["supervisor", "administrador"],
  "/panel/mis-solicitudes": ["aprobador", "proveedor", "administrador"],
  
  "/panel/workflow": ["supervisor", "administrador"],
  "/panel/aprobadores": ["supervisor", "administrador"],
  "/panel/proveedores": ["supervisor", "administrador"],
  "/panel/reasignaciones": ["supervisor", "administrador"],
  "/panel/notificaciones": ["supervisor", "administrador"],
  "/panel/reportes": ["supervisor", "aprobador", "administrador"],
  "/panel/auditoria": ["supervisor", "administrador"],
  "/panel/configuracion": ["supervisor", "administrador"],
  // Módulos solo para administrador (técnicos/soporte)
  "/panel/preordenes": ["administrador"],
  "/panel/seguimiento": ["administrador"],
  "/panel/peoplesoft": ["administrador"],
  "/panel/soporte": ["administrador"],
  "/panel/portal-proveedor": ["proveedor", "administrador"],
  "/panel/vendedor": ["administrador"],
};

export function canAccessRoute(pathname: string, roles: AppRole[]): boolean {
  if (roles.includes("administrador")) return true;
  // Find the most specific matching entry
  const match = Object.keys(ROUTE_PERMISSIONS)
    .filter((p) => pathname === p || pathname.startsWith(p + "/"))
    .sort((a, b) => b.length - a.length)[0];
  if (!match) return true; // unknown route - allow
  const allowed = ROUTE_PERMISSIONS[match];
  return allowed.some((r) => roles.includes(r));
}
