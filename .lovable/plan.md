## Objetivo

Bloquear el dashboard detrás del login. Nadie podrá ver `/dashboard/*` sin estar autenticado. Crear usuario de prueba `test@corbeta.com.co` / `123456789`.

## Cambios

### 1. Redirigir raíz al login cuando no hay sesión
- `src/routes/index.tsx`: hoy redirige a `/dashboard`. Cambiarlo para que verifique sesión con `supabase.auth.getSession()` en `beforeLoad` y redirija a `/login` si no hay sesión, o a `/dashboard` si la hay.

### 2. Proteger toda la sección `/dashboard`
- `src/routes/dashboard.tsx` (layout padre de todas las páginas del dashboard): añadir `beforeLoad` que verifique sesión con `supabase.auth.getUser()`. Si no hay usuario, `throw redirect({ to: "/login" })`. Esto cubre `/dashboard`, `/dashboard/approvals`, `/dashboard/requests`, `/dashboard/requests/$id`, `/dashboard/settings`, `/dashboard/audit`, etc. en un solo lugar.
- Marcar la ruta `ssr: false` para que la verificación de sesión (que vive en `localStorage`) funcione en refresh sin loop.

### 3. Logout funcional
- Añadir botón "Cerrar sesión" en el header del layout `dashboard.tsx` que llame `supabase.auth.signOut()` y navegue a `/login`. Hoy no existe una salida; sin esto el gate no es útil.

### 4. Login → dashboard
- `src/routes/login.tsx` ya hace `signInWithPassword` y navega a `/`. Tras el cambio (1), `/` enviará al dashboard cuando haya sesión. Si ya hay sesión al entrar a `/login`, redirigir a `/dashboard` desde `beforeLoad`.

### 5. Crear usuario de prueba
- Crear el usuario `test@corbeta.com.co` con contraseña `123456789` en Lovable Cloud (Auth) con email auto-confirmado, para que pueda iniciar sesión inmediatamente sin verificar correo.

## Notas

- No se toca la lógica de negocio ni el UI del dashboard; solo se añade el gate y el botón de logout.
- La contraseña `123456789` es débil; aceptable solo como credencial de prueba/demo.
- No se agregan tablas ni roles; es únicamente auth de Lovable Cloud.
