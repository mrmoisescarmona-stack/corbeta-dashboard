import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    throw redirect({ to: data.session ? "/panel" : "/login" });
  },
  component: () => (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      Redirigiendo…
    </div>
  ),
});
