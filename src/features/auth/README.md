# 🔐 Auth Feature

Sistema de autenticación reutilizable para proyectos Next.js (App Router).

**Stack:** Prisma + bcryptjs + sesiones en DB + cookies httpOnly + rate limiting

---

## Estructura

```
features/auth/
├── components/
│   └── login-form.tsx       # Formulario de login (shadcn/ui)
├── hooks/
│   └── use-auth.ts          # useAuth() — hook cliente
├── lib/
│   ├── auth.ts              # hashPassword, verifyPassword, getUserByIdentifier
│   ├── auth-guards.ts       # withAuth, withAdmin, requireAuth, requireAdmin
│   ├── middleware-auth.ts   # handleAuthMiddleware (para middleware.ts)
│   ├── rate-limit.ts        # Rate limiter (memoria o Redis)
│   └── session.ts           # createSession, getSession, deleteSession
├── routes/
│   ├── login.ts             # Handler POST /api/auth/login
│   ├── logout.ts            # Handler POST /api/auth/logout
│   └── me.ts                # Handler GET  /api/auth/me
├── types/
│   └── auth.ts              # AuthUser, AuthSession, LoginResult
├── validations/
│   └── auth.ts              # loginSchema (Zod)
├── config.ts                # ⚙️  CONFIGURACIÓN CENTRAL
└── index.ts                 # Barrel export
```

---

## Instalación en un nuevo proyecto

### 1. Copiar la carpeta

```bash
cp -r features/auth tu-nuevo-proyecto/src/features/auth
```

### 2. Instalar dependencias

```bash
pnpm add bcryptjs zod react-hook-form @hookform/resolvers
pnpm add -D @types/bcryptjs
```

### 3. Schema de Prisma

Agregá estos modelos al `schema.prisma`:

```prisma
model User {
  id             String    @id @default(uuid())
  name           String?
  email          String    @unique
  role           String    @default("COLLABORATOR")  # o un enum Role
  isActive       Boolean   @default(true)
  hashedPassword String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  sessions       Session[]
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id])
}
```

```bash
pnpm prisma migrate dev --name add-auth
```

### 4. Variables de entorno

```env
DATABASE_URL="postgresql://..."
NODE_ENV="development"          # en prod: "production"
```

### 5. Configurar la feature

Editá `features/auth/config.ts`:

```ts
export const AUTH_CONFIG = {
  SESSION_DURATION_MS: 8 * 60 * 60 * 1000,  // 8 horas
  COOKIE_NAME: "session",
  RATE_LIMIT: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 15 * 60 * 1000,
  },
  ROUTES: {
    LOGIN: "/admin/login",          // ← ajustar
    AFTER_LOGIN: "/admin",          // ← ajustar
    AFTER_LOGOUT: "/admin/login",   // ← ajustar
    PROTECTED_PREFIX: "/admin",     // ← ajustar
  },
  IDENTIFIER_MODE: "email",         // "email" | "username" | "any"
}
```

### 6. Conectar el path de Prisma

En `lib/session.ts` y `lib/auth.ts`, ajustá el import:

```ts
// Cambiá esto por el path real de tu instancia de prisma
import { prisma } from "@/lib/db"
```

### 7. Crear las API routes

```ts
// app/api/auth/login/route.ts
export { POST } from "@/features/auth/routes/login"

// app/api/auth/logout/route.ts
export { POST } from "@/features/auth/routes/logout"

// app/api/auth/me/route.ts
export { GET } from "@/features/auth/routes/me"
```

### 8. Configurar el middleware

```ts
// src/middleware.ts
import { handleAuthMiddleware } from "@/features/auth/lib/middleware-auth"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  return handleAuthMiddleware(request)
}

export const config = {
  matcher: ["/admin/:path*"],
}
```

> Si necesitás combinar con otra lógica (cache headers, etc.), 
> llamá `handleAuthMiddleware` dentro de tu middleware existente.

### 9. Usar el formulario de login

```tsx
// app/admin/login/page.tsx
import { LoginForm } from "@/features/auth/components/login-form"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <LoginForm title="Panel de administración" />
    </main>
  )
}
```

### 10. Proteger Route Handlers

```ts
// app/api/cars/route.ts
import { withAuth, withAdmin } from "@/features/auth"

export const GET = withAuth(async (request, user) => {
  // user.id, user.role, user.email disponibles
  return NextResponse.json({ cars: [] })
})

export const DELETE = withAdmin(async (request, user) => {
  return NextResponse.json({ deleted: true })
})
```

### 11. Proteger Server Components

```tsx
// app/admin/page.tsx
import { requireAuth } from "@/features/auth"

export default async function AdminPage() {
  const user = await requireAuth() // redirect automático si no hay sesión
  return <div>Hola {user.name}</div>
}
```

### 12. Crear el primer usuario admin

```ts
// En un seed o script de inicialización
import { hashPassword } from "@/features/auth"
import { prisma } from "@/lib/db"

await prisma.user.create({
  data: {
    email: "admin@tudominio.com",
    name: "Admin",
    hashedPassword: await hashPassword("tu-password-segura"),
    role: "ADMIN",
    isActive: true,
  },
})
```

---

## Personalización por proyecto

| Qué cambiar | Dónde |
|---|---|
| Duración de sesión | `config.ts → SESSION_DURATION_MS` |
| Rutas de login/admin | `config.ts → ROUTES` |
| Modo de identifier | `config.ts → IDENTIFIER_MODE` |
| Max intentos / ventana | `config.ts → RATE_LIMIT` |
| Logging post-login | `routes/login.ts → onLoginSuccess` (comentado) |
| Redis en lugar de memoria | `lib/rate-limit.ts` (instrucciones al final del archivo) |
| Roles personalizados | `types/auth.ts → Role` |

---

## Seguridad

| Medida | Implementación |
|---|---|
| Contraseñas | bcrypt con cost factor 10 |
| Cookie | `httpOnly`, `secure` (prod), `sameSite: lax` |
| Sesión en DB | Token UUID aleatorio, expira en DB y cookie |
| Rate limiting | 5 intentos / 15 min por IP |
| Mensajes de error | Genéricos (no revelan si el usuario existe) |
| Sesiones expiradas | Se limpian al intentar usarlas |
| Expiración DB | `cleanupExpiredSessions()` para cron jobs |

---

## Limitaciones conocidas

- **Rate limiter en memoria**: se resetea con cada restart del servidor.
  En Vercel/serverless, cada instancia tiene su propio mapa.
  → Para producción multi-instancia, usar Redis (ver `lib/rate-limit.ts`).

- **Middleware superficial**: solo valida que la cookie existe, no que sea válida en DB.
  La validación real contra DB ocurre en `getSession()` / `requireAuth()` / `withAuth()`.
  Esto es intencional: el middleware Edge Runtime no tiene acceso a Prisma.
