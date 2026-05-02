# 🖼️ Images Feature

Sistema de upload y gestión de imágenes agnóstico al provider para proyectos Next.js (App Router).

**Providers incluidos:** Cloudinary · Vercel Blob · AWS S3 · Cloudflare R2 · Local (dev)

---

## Cambiar de provider

Solo cambiás una variable de entorno — ningún componente ni página toca código:

```env
IMAGE_PROVIDER=cloudinary    # default
IMAGE_PROVIDER=vercel-blob
IMAGE_PROVIDER=s3
IMAGE_PROVIDER=r2            # usa el mismo provider que s3
IMAGE_PROVIDER=local         # desarrollo sin cuenta externa
```

---

## Estructura

```
features/images/
├── config.ts                        # ⚙️ provider activo, variantes, límites
├── types/images.ts                  # UploadResult, DeleteResult, ImageVariant
├── lib/
│   ├── image-provider.interface.ts  # Contrato de todos los providers
│   ├── image-service.ts             # Singleton factory — API pública
│   ├── resolve-image-url.ts         # resolveImageUrl() para componentes
│   └── validate-upload.ts           # Validaciones cliente + servidor
├── providers/
│   ├── cloudinary.provider.ts       # ✅ listo
│   ├── vercel-blob.provider.ts      # ✅ listo (pnpm add @vercel/blob)
│   ├── s3.provider.ts               # ✅ listo — AWS S3 + Cloudflare R2
│   └── local.provider.ts            # ✅ dev local, sin cuenta externa
├── routes/
│   └── upload.ts                    # POST y DELETE /api/upload
├── hooks/
│   └── use-image-upload.ts          # Lógica de upload extraída del componente
├── components/
│   └── image-upload.tsx             # UI de upload (shadcn/ui)
└── index.ts                         # Barrel export
```

---

## Instalación en un nuevo proyecto

### 1. Copiar la carpeta

```bash
cp -r features/images tu-nuevo-proyecto/src/features/images
```

### 2. Instalar dependencias base

```bash
pnpm add cloudinary          # si usás Cloudinary
```

Solo instalás el SDK del provider que vas a usar:

```bash
pnpm add @vercel/blob                              # Vercel Blob
pnpm add @aws-sdk/client-s3 @aws-sdk/lib-storage  # S3 / R2
# local: sin dependencias extra
```

### 3. Configurar variables de entorno

**Cloudinary:**
```env
IMAGE_PROVIDER=cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_UPLOAD_FOLDER=uploads   # opcional, default: "uploads"
```

**Vercel Blob:**
```env
IMAGE_PROVIDER=vercel-blob
BLOB_READ_WRITE_TOKEN=tu_token
NEXT_PUBLIC_BLOB_BASE_URL=https://xxx.public.blob.vercel-storage.com
```

**AWS S3:**
```env
IMAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=tu_key
AWS_SECRET_ACCESS_KEY=tu_secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=tu-bucket
NEXT_PUBLIC_S3_PUBLIC_BASE_URL=https://tu-bucket.s3.amazonaws.com
```

**Cloudflare R2:**
```env
IMAGE_PROVIDER=r2
AWS_ACCESS_KEY_ID=tu_r2_access_key
AWS_SECRET_ACCESS_KEY=tu_r2_secret
AWS_REGION=auto
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_BUCKET_NAME=tu-bucket
NEXT_PUBLIC_S3_PUBLIC_BASE_URL=https://tu-dominio-publico.com
```

**Local (dev):**
```env
IMAGE_PROVIDER=local
# opcional:
LOCAL_UPLOAD_DIR=public/uploads
LOCAL_PUBLIC_PATH=/uploads
```

### 4. Crear la API route

```ts
// app/api/upload/route.ts
export { POST, DELETE } from "@/features/images/routes/upload"
```

### 5. Ajustar el import de auth en routes/upload.ts

```ts
// Cambiá esta línea por el path real de tu feature de auth:
import { getSession } from "@/features/auth/lib/session"
```

### 6. Hook de negocio — autorización DELETE

Si necesitás verificar que la imagen pertenece a un recurso del usuario, editá `routes/upload.ts`:

```ts
async function canDeleteImage(key: string, userId: string, role: string): Promise<boolean> {
  // Ejemplo para un proyecto de autos:
  const cars = await prisma.car.findMany({ where: { images: { has: key } } })
  if (cars.length === 0) return true
  return cars.some(c => c.userId === userId) || role === "ADMIN"
}
```

### 7. Usar en componentes

```tsx
// Componente de upload (con UI)
import { ImageUpload } from "@/features/images/components/image-upload"

<ImageUpload value={images} onChange={setImages} />

// Resolver URL de una imagen
import { resolveImageUrl } from "@/features/images"

const url = resolveImageUrl(car.images[0], "card")

// Solo la lógica, sin UI
import { useImageUpload } from "@/features/images/hooks/use-image-upload"

const { upload, remove, uploading, progress } = useImageUpload({ value, onChange })
```

---

## Crear un provider custom

Implementá la interface `ImageProvider`:

```ts
// features/images/providers/mi-provider.provider.ts
import type { ImageProvider } from "../lib/image-provider.interface"

export class MiProvider implements ImageProvider {
  async upload(file: File) { ... }
  async delete(key: string) { ... }
  async deleteMany(keys: string[]) { ... }
  resolveUrl(key: string, variant: ImageVariant) { ... }
}
```

Luego registralo en `lib/image-service.ts`:

```ts
case "mi-provider": {
  const { MiProvider } = require("../providers/mi-provider.provider")
  _provider = new MiProvider()
  break
}
```

Y agregá el tipo en `config.ts`:

```ts
export type ImageProviderName = "cloudinary" | "vercel-blob" | "s3" | "r2" | "local" | "mi-provider"
```

---

## Diferencias entre providers

| Feature | Cloudinary | Vercel Blob | S3 / R2 | Local |
|---|---|---|---|---|
| Transformaciones URL | ✅ automáticas | ❌ | ❌ | ❌ |
| CDN incluido | ✅ | ✅ | con CloudFront | ❌ |
| Costo | freemium | pay-per-use | pay-per-use | gratis |
| Para dev sin cuenta | ❌ | ❌ | ❌ | ✅ |
| Producción | ✅ | ✅ | ✅ | ❌ |

> **Nota sobre variantes:** Cloudinary aplica resize/crop en la URL. Los demás providers
> sirven la imagen original — para todas las variantes retornan la misma URL.
> Si necesitás resize en S3/R2, combiná con CloudFront + Lambda@Edge o usá
> el componente `<Image>` de Next.js con `remotePatterns` configurado.

---

## Conventional commit sugerido

```
feat(images): add provider-agnostic image upload feature
```
