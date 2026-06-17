import { useEffect, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "supervisor" | "aprobador" | "proveedor" | "administrador";

export interface AuthState {
  loading: boolean;
  user: User | null;
  roles: AppRole[];
  primaryRole: AppRole | null;
}

const ROLE_LABEL: Record<AppRole, string> = {
  supervisor: "Supervisor",
  aprobador: "Aprobador",
  proveedor: "Proveedor",
  administrador: "Administrador",
};

export function getRoleLabel(role: AppRole | null): string {
  return role ? ROLE_LABEL[role] : "Sin rol";
}

interface UserProfile {
  name: string;
  position: string;
  email: string;
  company?: string;
  role: AppRole;
  loginEmail: string;
}

// Perfiles de usuarios de prueba (mapeados por correo de login)
const USER_PROFILES: Record<string, UserProfile> = {
  "supervisor@corbeta.com.co": {
    name: "Carlos Andrés Gómez",
    position: "Supervisor de Aprobaciones",
    email: "carlos.gomez@corbeta.com.co",
    role: "supervisor",
    loginEmail: "supervisor@corbeta.com.co",
  },
  "aprobador@corbeta.com.co": {
    name: "Juan Sebastián Rodríguez",
    position: "Analista de Aprobaciones Comerciales",
    email: "juan.rodriguez@corbeta.com.co",
    role: "aprobador",
    loginEmail: "aprobador@corbeta.com.co",
  },
  "proveedor@corbeta.com.co": {
    name: "María Fernanda Restrepo",
    position: "Ejecutiva Comercial de Proveedor",
    email: "maria.restrepo@alimentosandinos.com.co",
    company: "Alimentos Andinos S.A.",
    role: "proveedor",
    loginEmail: "proveedor@corbeta.com.co",
  },
  "admin@corbeta.com.co": {
    name: "Andrés Felipe Ramírez",
    position: "Administrador del Sistema",
    email: "andres.ramirez@corbeta.com.co",
    role: "administrador",
    loginEmail: "admin@corbeta.com.co",
  },
};

export function getAllDemoProfiles(): UserProfile[] {
  return Object.values(USER_PROFILES);
}

const IMPERSONATION_KEY = "demo.impersonation.loginEmail";
const IMPERSONATION_EVENT = "auth:impersonation";

export function getImpersonatedLogin(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(IMPERSONATION_KEY);
}

export function setImpersonatedLogin(loginEmail: string | null) {
  if (typeof window === "undefined") return;
  if (loginEmail) window.localStorage.setItem(IMPERSONATION_KEY, loginEmail);
  else window.localStorage.removeItem(IMPERSONATION_KEY);
  window.dispatchEvent(new Event(IMPERSONATION_EVENT));
}

export function getUserProfile(user: User | null): UserProfile | null {
  if (!user?.email) return null;
  return USER_PROFILES[user.email.toLowerCase()] ?? null;
}


export function getUserDisplayName(user: User | null): string {
  if (!user) return "Invitado";
  const profile = getUserProfile(user);
  if (profile) return profile.name;
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const name = (meta.full_name as string) || (meta.name as string);
  if (name) return name;
  const email = user.email ?? "";
  const local = email.split("@")[0] ?? "";
  if (!local) return "Usuario";
  return local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getUserEmail(user: User | null): string {
  const profile = getUserProfile(user);
  return profile?.email ?? user?.email ?? "";
}

export function getUserPosition(user: User | null, role: AppRole | null): string {
  const profile = getUserProfile(user);
  if (profile) return profile.position;
  return getRoleLabel(role);
}

export function getUserInitials(user: User | null): string {
  const name = getUserDisplayName(user);
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}


export function useAuth(): AuthState & {
  hasRole: (r: AppRole) => boolean;
  hasAnyRole: (rs: AppRole[]) => boolean;
  impersonating: boolean;
  realPrimaryRole: AppRole | null;
  realUserEmail: string | null;
} {

  const [state, setState] = useState<AuthState>({
    loading: true,
    user: null,
    roles: [],
    primaryRole: null,
  });

  const loadRoles = useCallback(async (user: User | null) => {
    if (!user) {
      setState({ loading: false, user: null, roles: [], primaryRole: null });
      return;
    }
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    if (error) {
      console.error("Error fetching roles", error);
      setState({ loading: false, user, roles: [], primaryRole: null });
      return;
    }
    const roles = (data ?? []).map((r) => r.role as AppRole);
    // administrador wins, then supervisor, aprobador, proveedor
    const priority: AppRole[] = ["administrador", "supervisor", "aprobador", "proveedor"];
    const primary = priority.find((p) => roles.includes(p)) ?? null;
    setState({ loading: false, user, roles, primaryRole: primary });
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      void loadRoles(data.session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadRoles(session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [loadRoles]);

  const [imp, setImp] = useState<string | null>(() => getImpersonatedLogin());
  useEffect(() => {
    const sync = () => setImp(getImpersonatedLogin());
    window.addEventListener("auth:impersonation", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth:impersonation", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Apply impersonation override (demo only)
  let effState = state;
  if (imp && state.user) {
    const profile = USER_PROFILES[imp.toLowerCase()];
    if (profile) {
      effState = {
        loading: state.loading,
        user: { ...state.user, email: profile.loginEmail } as User,
        roles: [profile.role],
        primaryRole: profile.role,
      };
    }
  }

  const hasRole = (r: AppRole) => effState.roles.includes(r);
  const hasAnyRole = (rs: AppRole[]) => rs.some((r) => effState.roles.includes(r));

  return {
    ...effState,
    hasRole,
    hasAnyRole,
    impersonating: !!imp && !!state.user && imp.toLowerCase() !== state.user.email?.toLowerCase(),
    realPrimaryRole: state.primaryRole,
    realUserEmail: state.user?.email ?? null,
  };
}


