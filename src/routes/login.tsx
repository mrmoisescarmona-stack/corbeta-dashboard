import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import logoAsset from "@/assets/logo_corbeta.png.asset.json";
import slideCartagena from "@/assets/slide-cartagena.jpg.asset.json";
import slideFlag from "@/assets/slide-flag.jpg.asset.json";
import slidePanoramic from "@/assets/slide-panoramic.jpg.asset.json";
const logo = logoAsset.url;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SLIDE_DURATION = 12000;

const slides = [
  {
    image: slideCartagena.url,
    eyebrow: "Aprobaciones de descuentos",
    title: (
      <>
        Descuentos comerciales,{" "}
        <span className="italic font-light opacity-80">aprobados</span> en horas.
      </>
    ),
    body: "Solicita, justifica y autoriza descuentos especiales con trazabilidad completa por cliente y región.",
    stat: { value: "98%", label: "SLA cumplido" },
    micro: [
      { value: "12.4h", label: "Tiempo interno" },
      { value: "240+", label: "Solicitudes/sem" },
    ],
  },
  {
    image: slideFlag.url,
    eyebrow: "Operación nacional",
    title: (
      <>
        Cobertura en todo{" "}
        <span className="italic font-light opacity-80">Colombia</span>, en un flujo.
      </>
    ),
    body: "Centraliza aprobaciones de sucursales, distribuidores y aliados desde la costa hasta el interior del país.",
    stat: { value: "32", label: "Departamentos activos" },
    micro: [
      { value: "1.8k", label: "Usuarios activos" },
      { value: "24/7", label: "Disponibilidad" },
    ],
  },
  {
    image: slidePanoramic.url,
    eyebrow: "Proveedores y compras",
    title: (
      <>
        Proveedores nuevos{" "}
        <span className="italic font-light opacity-80">validados</span> sin fricción.
      </>
    ),
    body: "Onboarding documental, comité y aprobaciones financieras conectadas en un mismo expediente digital.",
    stat: { value: "3.2d", label: "Onboarding promedio" },
    micro: [
      { value: "560+", label: "Proveedores" },
      { value: "100%", label: "Trazabilidad" },
    ],
  },
];

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "No se pudo iniciar sesión");
      return;
    }
    toast.success("Bienvenido");
    navigate({ to: "/" });
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
        {/* Abstract layers */}
        <div
          className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full blur-3xl opacity-60 animate-float"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--success) 80%, transparent), transparent 65%)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-24 h-[440px] w-[440px] rounded-full blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--warning) 70%, transparent), transparent 65%)",
          }}
        />

        {/* Dotted grid texture */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <pattern id="dotgrid" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotgrid)" />
        </svg>

        {/* Slow rotating conic ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%] h-[460px] w-[460px] pointer-events-none">
          <div
            className="absolute inset-0 rounded-full animate-spin-slow opacity-40"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--success) 70%, transparent) 90deg, transparent 180deg, color-mix(in oklab, var(--warning) 60%, transparent) 270deg, transparent 360deg)",
              mask: "radial-gradient(circle, transparent 58%, black 59%, black 62%, transparent 63%)",
              WebkitMask:
                "radial-gradient(circle, transparent 58%, black 59%, black 62%, transparent 63%)",
            }}
          />
          <div
            className="absolute inset-12 rounded-full border border-white/10"
            style={{
              boxShadow:
                "inset 0 0 80px color-mix(in oklab, var(--success) 30%, transparent)",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest opacity-80">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Plataforma interna · v2.4
          </div>

          <div className="space-y-8 max-w-md">
            <p className="text-[11px] uppercase tracking-[0.25em] opacity-70">
              Portal de aprobaciones
            </p>
            <h2 className="text-[44px] font-semibold leading-[1.05] tracking-tight">
              Aprobaciones más rápidas,{" "}
              <span className="italic font-light opacity-80">decisiones</span> más claras.
            </h2>
            <p className="text-base opacity-80 leading-relaxed">
              Centraliza solicitudes, da seguimiento a proveedores y mantén tus
              operaciones en movimiento desde un solo lugar.
            </p>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 flex items-center gap-5">
              <div>
                <p className="text-3xl font-semibold leading-none">98%</p>
                <p className="text-[11px] opacity-70 mt-2 uppercase tracking-wider">
                  SLA cumplido
                </p>
              </div>
              <div className="h-10 w-px bg-white/15" />
              <div className="flex-1 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium">12.4h</p>
                  <p className="opacity-60">Tiempo interno</p>
                </div>
                <div>
                  <p className="font-medium">240+</p>
                  <p className="opacity-60">Solicitudes/sem</p>
                </div>
              </div>
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
