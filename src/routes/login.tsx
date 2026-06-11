import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import logo from "@/assets/logo_corbeta.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Corbeta Approvals" },
      { name: "description", content: "Accede al portal de aprobaciones de Corbeta." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate({ to: "/" });
    }, 600);
  };

  return (
    <main className="min-h-screen w-full bg-background flex">
      {/* Left: form */}
      <section className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <img src={logo} alt="Corbeta" className="h-10 w-auto" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">Corbeta</p>
              <p className="text-xs text-muted-foreground">Portal de Aprobaciones</p>
            </div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Bienvenido de vuelta
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Inicia sesión con tu cuenta corporativa para continuar.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@corbeta.com"
                  className="pl-9 h-11"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  to="/login"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-10 h-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                Mantener sesión iniciada
              </Label>
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-medium" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">o continúa con</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full h-11 gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              SSO corporativo (Microsoft)
            </Button>
          </form>

          <p className="mt-10 text-xs text-muted-foreground text-center">
            ¿Problemas para acceder? Contacta a{" "}
            <a href="mailto:soporte@corbeta.com" className="text-primary hover:underline">
              soporte@corbeta.com
            </a>
          </p>
        </div>
      </section>

      {/* Right: brand panel */}
      <aside className="hidden lg:flex flex-1 relative overflow-hidden bg-primary text-primary-foreground">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--success) 60%, transparent), transparent 50%), radial-gradient(circle at 80% 80%, color-mix(in oklab, var(--warning) 50%, transparent), transparent 55%)",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest opacity-80">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Plataforma interna
          </div>

          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight">
              Aprobaciones más rápidas, decisiones más claras.
            </h2>
            <p className="text-base opacity-80 leading-relaxed">
              Centraliza solicitudes, da seguimiento a proveedores y mantén tus
              operaciones en movimiento desde un solo lugar.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <Stat value="98%" label="SLA cumplido" />
              <Stat value="12.4h" label="Tiempo interno" />
              <Stat value="240+" label="Solicitudes/sem" />
            </div>
          </div>

          <p className="text-xs opacity-60">
            © {new Date().getFullYear()} Corbeta · Todos los derechos reservados
          </p>
        </div>
      </aside>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 p-3">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-[11px] opacity-75 mt-0.5">{label}</p>
    </div>
  );
}
