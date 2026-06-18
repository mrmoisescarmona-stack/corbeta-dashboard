import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import logoColor from "@/assets/corbeta_color.png.asset.json";
import logoWhite from "@/assets/corbeta_white.png.asset.json";
import slideCartagena from "@/assets/slide-cartagena.jpg.asset.json";
import slideFlag from "@/assets/slide-flag.jpg.asset.json";
import slidePanoramic from "@/assets/slide-panoramic.jpg.asset.json";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SLIDE_DURATION = 7000;
const REVEAL_FIELDS = ["eyebrow", "title", "body", "stat"] as const;

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
      { title: "Iniciar sesión — Corbeta Aprobaciones" },
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
            <img src={logoColor.url} alt="Corbeta" className="h-10 w-auto block dark:hidden" />
            <img src={logoWhite.url} alt="Corbeta" className="h-10 w-auto hidden dark:block" />
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
                  placeholder="nombre@corbeta.com.co"
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
            <a href="mailto:soporte@corbeta.com.co" className="text-primary hover:underline">
              soporte@corbeta.com.co
            </a>
          </p>
        </div>
      </section>

      {/* Right: brand panel slider */}
      <BrandSlider />
    </main>
  );
}

function BrandSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(t);
  }, []);

  return (
    <aside className="hidden lg:flex flex-1 relative overflow-hidden bg-primary text-primary-foreground">
      {/* Background images (crossfade + ken burns) */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: i === index ? 0.65 : 0 }}
          aria-hidden
        >
          <div
            key={`img-${i}-${i === index ? index : "idle"}`}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${s.image})`,
              filter: "saturate(1.1) contrast(1.05)",
              animation:
                i === index
                  ? `kenburns ${SLIDE_DURATION + 1500}ms ease-out forwards`
                  : "none",
            }}
          />
        </div>
      ))}

      {/* Blue tints — softer top, stronger bottom for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, color-mix(in oklab, var(--primary) 45%, transparent), color-mix(in oklab, var(--primary) 25%, transparent))",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklab, var(--primary) 75%, transparent) 0%, color-mix(in oklab, var(--primary) 40%, transparent) 35%, transparent 65%)",
        }}
        aria-hidden
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

      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest opacity-80">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Plataforma interna · v2.4
        </div>

        <div className="relative max-w-md min-h-[380px]">
          {slides.map((s, i) => {
            const active = i === index;
            const reveal = (order: number) =>
              active
                ? {
                    animation: `slide-reveal 700ms cubic-bezier(0.22,1,0.36,1) both`,
                    animationDelay: `${order * 90}ms`,
                  }
                : { opacity: 0, transform: "translateY(-6px)" };
            return (
              <div
                key={i}
                className="absolute inset-0 space-y-7"
                style={{
                  opacity: active ? 1 : 0,
                  transition: active ? "none" : "opacity 300ms ease-out",
                  pointerEvents: active ? "auto" : "none",
                }}
                aria-hidden={!active}
              >
                <p
                  key={`eb-${i}-${index}`}
                  className="text-[11px] uppercase tracking-[0.25em] opacity-70"
                  style={reveal(0)}
                >
                  {s.eyebrow}
                </p>
                <h2
                  key={`ti-${i}-${index}`}
                  className="text-[44px] font-semibold leading-[1.05] tracking-tight"
                  style={reveal(1)}
                >
                  {s.title}
                </h2>
                <p
                  key={`bo-${i}-${index}`}
                  className="text-base opacity-85 leading-relaxed"
                  style={reveal(2)}
                >
                  {s.body}
                </p>

                <div
                  key={`st-${i}-${index}`}
                  className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 flex items-center gap-5"
                  style={reveal(3)}
                >
                  <div>
                    <p className="text-3xl font-semibold leading-none">{s.stat.value}</p>
                    <p className="text-[11px] opacity-70 mt-2 uppercase tracking-wider">
                      {s.stat.label}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-white/15" />
                  <div className="flex-1 grid grid-cols-2 gap-3 text-xs">
                    {s.micro.map((m) => (
                      <div key={m.label}>
                        <p className="font-medium">{m.value}</p>
                        <p className="opacity-60">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slider progress loaders */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="relative h-[2px] flex-1 max-w-[80px] rounded-full bg-white/15 overflow-hidden"
                aria-label={`Ir al slide ${i + 1}`}
              >
                <span
                  key={`${i}-${index}`}
                  className="absolute inset-y-0 left-0 bg-white rounded-full"
                  style={{
                    width: i < index ? "100%" : "0%",
                    boxShadow:
                      i === index ? "0 0 8px rgba(255,255,255,0.55)" : "none",
                    animation:
                      i === index
                        ? `slideProgress ${SLIDE_DURATION}ms linear forwards`
                        : "none",
                  }}
                />
              </button>
            ))}
            <span className="text-[11px] opacity-60 tabular-nums ml-2">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          <p className="text-xs opacity-60">
            © {new Date().getFullYear()} Corbeta · Todos los derechos reservados
          </p>
        </div>
      </div>
    </aside>
  );
}
