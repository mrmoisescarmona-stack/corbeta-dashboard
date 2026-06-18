import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ApproverScope = {
  code: string;
  description: string;
  limit: string;
  status: "Activo" | "Pendiente";
};

export type Approver = {
  name: string;
  id: string;
  direction: string;
  division: string;
  active: boolean;
  status?: "Activo" | "Inactivo" | "Pendiente";
  email: string;
  phone: string;
  manager: string;
  zone: string;
  unit: string;
  startDate: string;
  scopes: ApproverScope[];
};

type Row = {
  identification: string;
  name: string;
  direction: string;
  division: string;
  active: boolean;
  status: string;
  email: string;
  phone: string;
  manager: string;
  zone: string;
  unit: string;
  start_date: string | null;
  scopes: unknown;
};

const rowToApprover = (r: Row): Approver => ({
  id: r.identification,
  name: r.name,
  direction: r.direction,
  division: r.division,
  active: r.active,
  status: (r.status as Approver["status"]) ?? "Activo",
  email: r.email,
  phone: r.phone ?? "",
  manager: r.manager ?? "",
  zone: r.zone ?? "",
  unit: r.unit ?? "",
  startDate: r.start_date ?? "",
  scopes: Array.isArray(r.scopes) ? (r.scopes as ApproverScope[]) : [],
});

const approverToRow = (a: Approver) => ({
  identification: a.id,
  name: a.name,
  direction: a.direction,
  division: a.division,
  active: a.active,
  status: a.status ?? (a.active ? "Activo" : "Inactivo"),
  email: a.email,
  phone: a.phone ?? "",
  manager: a.manager ?? "",
  zone: a.zone ?? "",
  unit: a.unit ?? "",
  start_date: a.startDate || null,
  scopes: a.scopes ?? [],
});

const QUERY_KEY = ["approvers"] as const;

export function useApprovers() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<Approver[]> => {
      const { data, error } = await supabase
        .from("approvers")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return (data as Row[]).map(rowToApprover);
    },
  });
}

export function useAddApprover() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (a: Approver) => {
      const { error } = await supabase.from("approvers").insert(approverToRow(a));
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateApprover() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ originalId, approver }: { originalId: string; approver: Approver }) => {
      const { error } = await supabase
        .from("approvers")
        .update(approverToRow(approver))
        .eq("identification", originalId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteApprover() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (identification: string) => {
      const { error } = await supabase
        .from("approvers")
        .delete()
        .eq("identification", identification);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
