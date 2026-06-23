import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Check, ChevronRight, Plus, Search, Settings, Bell, Trash2, Download,
  Upload, Edit, Eye, Heart, Star, AlertCircle, Info, CheckCircle2,
  XCircle, Loader2, Moon, Sun, ArrowRight, Home, User, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/styleguide")({
  head: () => ({
    meta: [
      { title: "Style Guide" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StyleGuidePage,
});

const COLOR_TOKENS = [
  "background", "foreground", "card", "card-foreground", "popover", "popover-foreground",
  "primary", "primary-foreground", "secondary", "secondary-foreground",
  "muted", "muted-foreground", "accent", "accent-foreground",
  "success", "success-foreground", "warning", "warning-foreground",
  "destructive", "destructive-foreground",
  "border", "input", "ring",
  "sidebar", "sidebar-foreground", "sidebar-border", "sidebar-accent", "sidebar-accent-foreground",
];

const TYPE_SCALE = [
  { c: "text-xs", px: "12px / 0.75rem" },
  { c: "text-sm", px: "14px / 0.875rem" },
  { c: "text-base", px: "16px / 1rem" },
  { c: "text-lg", px: "18px / 1.125rem" },
  { c: "text-xl", px: "20px / 1.25rem" },
  { c: "text-2xl", px: "24px / 1.5rem" },
  { c: "text-3xl", px: "30px / 1.875rem" },
  { c: "text-4xl", px: "36px / 2.25rem" },
  { c: "text-5xl", px: "48px / 3rem" },
];

const SPACING = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24];
const RADII = [
  { c: "rounded-sm", v: "--radius-sm" },
  { c: "rounded-md", v: "--radius-md" },
  { c: "rounded-lg", v: "--radius-lg" },
  { c: "rounded-xl", v: "--radius-xl" },
  { c: "rounded-full", v: "9999px" },
];
const SHADOWS = ["shadow-xs", "shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"];

const TOC = [
  ["brand", "Marca"],
  ["colors", "Tokens de color"],
  ["typography", "Tipografía"],
  ["spacing", "Espaciado"],
  ["radius", "Bordes"],
  ["shadows", "Sombras"],
  ["hierarchy", "Jerarquía"],
  ["buttons", "Botones"],
  ["forms", "Formularios"],
  ["badges", "Badges y estados"],
  ["nav", "Navegación"],
  ["overlays", "Overlays"],
  ["feedback", "Feedback"],
  ["data", "Datos"],
  ["icons", "Iconos"],
  ["links", "Enlaces"],
  ["motion", "Movimiento"],
];

function useResolvedVar(name: string, dep: unknown) {
  const [v, setV] = useState("");
  useEffect(() => {
    const val = getComputedStyle(document.documentElement).getPropertyValue("--" + name).trim();
    setV(val);
  }, [name, dep]);
  return v;
}

function Swatch({ token, dark }: { token: string; dark: boolean }) {
  const v = useResolvedVar(token, dark);
  const isFg = token.includes("foreground") || token === "border" || token === "input" || token === "ring";
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      <div
        className="h-16 w-full border-b border-border"
        style={{ background: `var(--${token})` }}
      >
        {isFg && (
          <div className="h-full flex items-center justify-center text-xs font-medium" style={{ color: `var(--${token})` }}>
            Aa
          </div>
        )}
      </div>
      <div className="p-2 space-y-0.5">
        <div className="text-xs font-mono font-semibold">--{token}</div>
        <div className="text-[10px] font-mono text-muted-foreground truncate">{v || "—"}</div>
      </div>
    </div>
  );
}

function Section({ id, title, desc, children }: { id: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {desc && <p className="text-sm text-muted-foreground mt-1">{desc}</p>}
      </div>
      <Separator />
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-4 items-start py-3 border-b border-border last:border-0">
      <div className="text-xs font-mono text-muted-foreground pt-2">{label}</div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function StyleGuidePage() {
  const [dark, setDark] = useState(false);
  const [progress, setProgress] = useState(60);
  const [sliderVal, setSliderVal] = useState([40]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    return () => { document.documentElement.classList.remove("dark"); };
  }, [dark]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Toaster />
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">Style Guide</h1>
              <p className="text-xs text-muted-foreground">Sistema de diseño · referencia interna</p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch checked={dark} onCheckedChange={setDark} aria-label="Tema oscuro" />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10">
          {/* TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              {TOC.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="block text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <main className="space-y-16 min-w-0">
            {/* Brand */}
            <Section id="brand" title="Marca" desc="Identidad y colores principales de Corbeta.">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Corbeta Blue", hex: "#0A157A", oklch: "oklch(0.27 0.18 270)" },
                  { name: "Orange", hex: "#F57C00", oklch: "oklch(0.72 0.17 55)" },
                  { name: "Teal", hex: "#4CCFC1", oklch: "oklch(0.78 0.11 185)" },
                ].map((b) => (
                  <div key={b.name} className="rounded-lg border border-border overflow-hidden">
                    <div className="h-24" style={{ background: b.hex }} />
                    <div className="p-3 bg-card">
                      <div className="font-semibold text-sm">{b.name}</div>
                      <div className="text-xs font-mono text-muted-foreground">{b.hex}</div>
                      <div className="text-xs font-mono text-muted-foreground">{b.oklch}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Colors */}
            <Section id="colors" title="Tokens de color" desc="Cada token mapea a una variable CSS y a una clase Tailwind (bg-*, text-*, border-*).">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {COLOR_TOKENS.map((t) => <Swatch key={t} token={t} dark={dark} />)}
              </div>
            </Section>

            {/* Typography */}
            <Section id="typography" title="Tipografía" desc="Familia base: Inter. Pesos disponibles: 400 / 500 / 600 / 700.">
              <Card>
                <CardContent className="pt-6 space-y-3">
                  {TYPE_SCALE.map((t) => (
                    <div key={t.c} className="flex items-baseline justify-between gap-6 border-b border-border last:border-0 pb-3 last:pb-0">
                      <span className={`${t.c} font-medium`}>The quick brown fox</span>
                      <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">{t.c} · {t.px}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle className="text-base">Pesos</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {[400, 500, 600, 700].map((w) => (
                      <div key={w} className="flex justify-between"><span style={{ fontWeight: w }}>Texto de ejemplo {w}</span><span className="text-xs font-mono text-muted-foreground">font-weight: {w}</span></div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Jerarquía semántica</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">H1 Título principal</h1>
                    <h2 className="text-2xl font-bold tracking-tight">H2 Sección</h2>
                    <h3 className="text-xl font-semibold">H3 Subsección</h3>
                    <h4 className="text-lg font-semibold">H4 Bloque</h4>
                    <p className="text-sm">Párrafo body — texto estándar del sistema.</p>
                    <p className="text-sm text-muted-foreground">Texto secundario (muted-foreground).</p>
                    <p className="text-xs text-muted-foreground">Caption pequeña.</p>
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* Spacing */}
            <Section id="spacing" title="Espaciado" desc="Escala basada en 0.25rem (4px). Usa p-*, m-*, gap-*.">
              <div className="space-y-2">
                {SPACING.map((n) => (
                  <div key={n} className="flex items-center gap-4">
                    <span className="text-xs font-mono text-muted-foreground w-16">{n} · {n * 4}px</span>
                    <div className="h-4 bg-primary rounded" style={{ width: `${n * 4}px`, minWidth: n === 0 ? 1 : undefined }} />
                  </div>
                ))}
              </div>
            </Section>

            {/* Radius */}
            <Section id="radius" title="Bordes redondeados">
              <div className="flex flex-wrap gap-6">
                {RADII.map((r) => (
                  <div key={r.c} className="text-center space-y-2">
                    <div className={`h-20 w-20 bg-primary ${r.c}`} />
                    <div className="text-xs font-mono">{r.c}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{r.v}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Shadows */}
            <Section id="shadows" title="Sombras">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {SHADOWS.map((s) => (
                  <div key={s} className="text-center space-y-2">
                    <div className={`h-20 w-full bg-card border border-border rounded-lg ${s}`} />
                    <div className="text-xs font-mono">{s}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Hierarchy */}
            <Section id="hierarchy" title="Jerarquía de página" desc="Patrón usado en Soporte / Notificaciones / Auditoría.">
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Título de página</h1>
                  <p className="text-sm text-muted-foreground">Descripción corta que aporta contexto.</p>
                </div>
                <div className="space-y-3">
                  <h2 className="text-base font-semibold">Sección</h2>
                  <Card>
                    <CardContent className="pt-6 text-sm text-muted-foreground">Contenido de la card.</CardContent>
                  </Card>
                </div>
              </div>
            </Section>

            {/* Buttons */}
            <Section id="buttons" title="Botones" desc="Todas las variantes, tamaños y estados.">
              {(["default", "secondary", "outline", "ghost", "link", "destructive"] as const).map((v) => (
                <div key={v} className="rounded-lg border border-border p-4 space-y-2">
                  <div className="text-sm font-semibold capitalize mb-2">{v}</div>
                  <Row label="Tamaños">
                    <Button variant={v} size="sm">Small</Button>
                    <Button variant={v}>Default</Button>
                    <Button variant={v} size="lg">Large</Button>
                    <Button variant={v} size="icon"><Plus /></Button>
                  </Row>
                  <Row label="Estados">
                    <Button variant={v}>Normal</Button>
                    <Button variant={v} autoFocus={false} className="hover:!opacity-100" data-state="hover">Hover (pasa el mouse)</Button>
                    <Button variant={v} disabled>Disabled</Button>
                    <Button variant={v} disabled><Loader2 className="animate-spin" />Loading</Button>
                  </Row>
                  <Row label="Con icono">
                    <Button variant={v}><Plus />Crear</Button>
                    <Button variant={v}>Continuar<ArrowRight /></Button>
                    <Button variant={v} size="icon"><Settings /></Button>
                  </Row>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Tip: pasa el cursor sobre cualquier botón para ver el estado hover real. Focus visible aparece al navegar con teclado (Tab).</p>
            </Section>

            {/* Forms */}
            <Section id="forms" title="Formularios" desc="Inputs y controles en todos sus estados.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="text-base">Input</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5"><Label>Default</Label><Input placeholder="Escribe aquí…" /></div>
                    <div className="space-y-1.5"><Label>Con valor</Label><Input defaultValue="Hola mundo" /></div>
                    <div className="space-y-1.5"><Label>Disabled</Label><Input disabled placeholder="Disabled" /></div>
                    <div className="space-y-1.5"><Label>Readonly</Label><Input readOnly defaultValue="Solo lectura" /></div>
                    <div className="space-y-1.5">
                      <Label className="text-destructive">Error</Label>
                      <Input className="border-destructive focus-visible:ring-destructive" defaultValue="valor inválido" />
                      <p className="text-xs text-destructive">Este campo es requerido.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Textarea & Select</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5"><Label>Textarea</Label><Textarea placeholder="Comentarios…" /></div>
                    <div className="space-y-1.5">
                      <Label>Select</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Selecciona una opción" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">Opción A</SelectItem>
                          <SelectItem value="b">Opción B</SelectItem>
                          <SelectItem value="c">Opción C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Checkbox · Switch · Radio</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2"><Checkbox id="c1" /><Label htmlFor="c1">Unchecked</Label></div>
                      <div className="flex items-center gap-2"><Checkbox id="c2" defaultChecked /><Label htmlFor="c2">Checked</Label></div>
                      <div className="flex items-center gap-2"><Checkbox id="c3" disabled /><Label htmlFor="c3" className="opacity-50">Disabled</Label></div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2"><Switch id="s1" /><Label htmlFor="s1">Off</Label></div>
                      <div className="flex items-center gap-2"><Switch id="s2" defaultChecked /><Label htmlFor="s2">On</Label></div>
                      <div className="flex items-center gap-2"><Switch id="s3" disabled /><Label htmlFor="s3" className="opacity-50">Disabled</Label></div>
                    </div>
                    <RadioGroup defaultValue="b" className="flex gap-6">
                      <div className="flex items-center gap-2"><RadioGroupItem value="a" id="r1" /><Label htmlFor="r1">Opción A</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="b" id="r2" /><Label htmlFor="r2">Opción B</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="c" id="r3" disabled /><Label htmlFor="r3" className="opacity-50">Disabled</Label></div>
                    </RadioGroup>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Slider</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2"><Label>Valor: {sliderVal[0]}</Label><Slider value={sliderVal} onValueChange={setSliderVal} max={100} /></div>
                    <div className="space-y-2"><Label className="opacity-50">Disabled</Label><Slider defaultValue={[30]} max={100} disabled /></div>
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* Badges */}
            <Section id="badges" title="Badges y estados">
              <Row label="Variantes">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </Row>
              <Row label="Estados app">
                <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">Pendiente</Badge>
                <Badge className="bg-success text-success-foreground hover:bg-success/90">Aprobado</Badge>
                <Badge variant="destructive">Rechazado</Badge>
                <Badge variant="destructive">Vencido</Badge>
                <Badge variant="secondary">En revisión</Badge>
              </Row>
            </Section>

            {/* Nav */}
            <Section id="nav" title="Navegación">
              <Tabs defaultValue="t1">
                <TabsList>
                  <TabsTrigger value="t1">Tab uno</TabsTrigger>
                  <TabsTrigger value="t2">Tab dos</TabsTrigger>
                  <TabsTrigger value="t3" disabled>Disabled</TabsTrigger>
                </TabsList>
                <TabsContent value="t1" className="text-sm text-muted-foreground p-4">Contenido del tab uno.</TabsContent>
                <TabsContent value="t2" className="text-sm text-muted-foreground p-4">Contenido del tab dos.</TabsContent>
              </Tabs>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="a1">
                  <AccordionTrigger>¿Qué es esta página?</AccordionTrigger>
                  <AccordionContent>Una referencia visual del sistema de diseño.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="a2">
                  <AccordionTrigger>¿Cómo se accede?</AccordionTrigger>
                  <AccordionContent>Vía URL directa /styleguide. No está enlazada.</AccordionContent>
                </AccordionItem>
              </Accordion>

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href="#">Inicio</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbLink href="#">Sistema</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbPage>Style Guide</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                  <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationEllipsis /></PaginationItem>
                  <PaginationItem><PaginationNext href="#" /></PaginationItem>
                </PaginationContent>
              </Pagination>

              <Row label="Dropdown">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline">Abrir menú</Button></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                    <DropdownMenuItem><Download className="mr-2 h-4 w-4" />Descargar</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Row>
            </Section>

            {/* Overlays */}
            <Section id="overlays" title="Overlays">
              <Row label="Dialog">
                <Dialog>
                  <DialogTrigger asChild><Button>Abrir dialog</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ejemplo de Dialog</DialogTitle>
                      <DialogDescription>Diálogo modal estándar del sistema.</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </Row>
              <Row label="Sheet">
                <Sheet>
                  <SheetTrigger asChild><Button variant="outline">Abrir sheet</Button></SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Sheet lateral</SheetTitle>
                      <SheetDescription>Panel deslizable desde el borde.</SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </Row>
              <Row label="Popover">
                <Popover>
                  <PopoverTrigger asChild><Button variant="outline">Abrir popover</Button></PopoverTrigger>
                  <PopoverContent>Contenido del popover.</PopoverContent>
                </Popover>
              </Row>
              <Row label="Tooltip">
                <Tooltip>
                  <TooltipTrigger asChild><Button variant="ghost"><Info /> Pasa el mouse</Button></TooltipTrigger>
                  <TooltipContent>Tooltip de ayuda</TooltipContent>
                </Tooltip>
              </Row>
            </Section>

            {/* Feedback */}
            <Section id="feedback" title="Feedback">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Información</AlertTitle>
                <AlertDescription>Alerta neutra del sistema.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Algo falló al procesar la solicitud.</AlertDescription>
              </Alert>
              <Row label="Toasts">
                <Button onClick={() => toast.success("Operación exitosa")}><CheckCircle2 />Success</Button>
                <Button variant="destructive" onClick={() => toast.error("Algo salió mal")}><XCircle />Error</Button>
                <Button variant="outline" onClick={() => toast.warning("Atención requerida")}><AlertCircle />Warning</Button>
                <Button variant="secondary" onClick={() => toast.info("Solo para tu info")}><Info />Info</Button>
              </Row>
              <Row label="Progress">
                <div className="w-full max-w-md space-y-2">
                  <Progress value={progress} />
                  <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(+e.target.value)} className="w-full" />
                </div>
              </Row>
              <Row label="Skeleton">
                <div className="space-y-2 w-full max-w-md">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </Row>
            </Section>

            {/* Data */}
            <Section id="data" title="Visualización de datos">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card><CardHeader><CardTitle className="text-base">Card default</CardTitle><CardDescription>Descripción</CardDescription></CardHeader><CardContent className="text-sm">Contenido.</CardContent></Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer"><CardHeader><CardTitle className="text-base">Card hoverable</CardTitle></CardHeader><CardContent className="text-sm">Hover para sombra.</CardContent></Card>
                <Card className="ring-2 ring-primary"><CardHeader><CardTitle className="text-base">Card seleccionada</CardTitle></CardHeader><CardContent className="text-sm">Estado activo.</CardContent></Card>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow><TableCell>Solicitud #001</TableCell><TableCell><Badge className="bg-warning text-warning-foreground">Pendiente</Badge></TableCell><TableCell className="text-right">$1.200</TableCell></TableRow>
                    <TableRow><TableCell>Solicitud #002</TableCell><TableCell><Badge className="bg-success text-success-foreground">Aprobado</Badge></TableCell><TableCell className="text-right">$3.450</TableCell></TableRow>
                    <TableRow><TableCell>Solicitud #003</TableCell><TableCell><Badge variant="destructive">Rechazado</Badge></TableCell><TableCell className="text-right">$890</TableCell></TableRow>
                  </TableBody>
                </Table>
              </Card>

              <Row label="Avatars">
                {([6, 8, 10, 12] as const).map((s) => (
                  <Avatar key={s} className={`h-${s} w-${s}`}>
                    <AvatarImage src="" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                ))}
              </Row>
            </Section>

            {/* Icons */}
            <Section id="icons" title="Iconos" desc="lucide-react. Tamaños recomendados: 16 / 20 / 24 px.">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {[
                  { I: Home, n: "Home" }, { I: User, n: "User" }, { I: Mail, n: "Mail" },
                  { I: Bell, n: "Bell" }, { I: Settings, n: "Settings" }, { I: Search, n: "Search" },
                  { I: Plus, n: "Plus" }, { I: Edit, n: "Edit" }, { I: Trash2, n: "Trash2" },
                  { I: Download, n: "Download" }, { I: Upload, n: "Upload" }, { I: Eye, n: "Eye" },
                  { I: Heart, n: "Heart" }, { I: Star, n: "Star" }, { I: Check, n: "Check" },
                  { I: ChevronRight, n: "ChevronRight" },
                ].map(({ I, n }) => (
                  <div key={n} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                    <div className="flex items-end gap-2">
                      <I className="h-4 w-4" />
                      <I className="h-5 w-5" />
                      <I className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{n}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Links */}
            <Section id="links" title="Enlaces">
              <Row label="Estados">
                <a href="#" className="text-primary underline-offset-4 hover:underline">Default</a>
                <a href="#" className="text-primary underline underline-offset-4">Hover (forzado)</a>
                <a href="#" className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded">Focusable (Tab)</a>
                <span className="text-muted-foreground line-through cursor-not-allowed">Disabled</span>
              </Row>
            </Section>

            {/* Motion */}
            <Section id="motion" title="Movimiento" desc="Duraciones y easings usados en transiciones.">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "duration-150", c: "duration-150" },
                  { label: "duration-200 (default)", c: "duration-200" },
                  { label: "duration-300", c: "duration-300" },
                ].map((m) => (
                  <div key={m.c} className={`rounded-lg border border-border p-6 text-center transition-all ${m.c} hover:bg-primary hover:text-primary-foreground hover:scale-105 cursor-pointer`}>
                    <div className="text-sm font-semibold">{m.label}</div>
                    <div className="text-xs opacity-70 mt-1">Pasa el mouse</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Easing por defecto: <code className="font-mono">ease-in-out</code>. Clases comunes: <code className="font-mono">transition-colors</code>, <code className="font-mono">transition-shadow</code>, <code className="font-mono">transition-transform</code>, <code className="font-mono">animate-spin</code>.</p>
            </Section>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
