## Cambios de dominio y usuario

Aplicar dos ajustes globales en el sitio según el documento oficial del cliente ([https://www.corbeta.com.co/](https://www.corbeta.com.co/)).

### 1. Dominio `corbeta.com` → `corbeta.com.co`

- `**src/routes/login.tsx**`
  - Placeholder del campo email: `nombre@corbeta.com` → `nombre@corbeta.com.co`
  - Link de soporte (href + texto visible): `soporte@corbeta.com` → `soporte@corbeta.com.co`
- `**src/routes/dashboard.settings.tsx**`
  - Campo "Correo" del perfil: `ana.carolina@corbeta.com` → `kpaz@corbeta.com.co`

### 2. Nombre del usuario actual → Moises Carmona

- `**src/routes/dashboard.tsx**` (header, esquina superior derecha)
  - Nombre mostrado: `Ana Carolina` → `Moises Carmona`
  - Iniciales del avatar: `AC` → `MC`
- `**src/routes/dashboard.index.tsx**`
  - Saludo del home: `¡Bienvenida, Ana Carolina!` → `¡Bienvenido, Moises Carmona!`
- `**src/routes/dashboard.settings.tsx**`
  - Campo "Nombre" del perfil: `Ana Carolina` → `Moises Carmona`

### Fuera de alcance

- `src/routes/dashboard.audit.tsx` mantiene "Ana Carolina" en la lista mock de usuarios del log de auditoría (representa otros usuarios del sistema, no al usuario actual).
- No se tocan colores, layout, copy adicional ni lógica de auth/validaciones.