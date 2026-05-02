# 📱 Apple Store Demo

Landing page + catálogo de iPhones para venta por WhatsApp.

## 🧠 Propósito

Catálogo optimizado para tiendas de tecnología (iPhones) que venden a través de WhatsApp. No es ecommerce tradicional.

## 🚀 Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- ** Arquitectura**: Feature-Based

## 🏗️ Estructura

```
src/
├── app/           # Pages (Next.js App Router)
├── features/      # Funcionalidades por dominio
│   ├── catalog/  # Grid, cards, tipos de producto
│   ├── product/  # Detalle de producto
│   ├── filters/  # Filtros del catálogo
│   ├── whatsapp/# Link generador con mensaje dinámico
│   ├── layout/   # Header
│   ├── store/    # Info de la tienda
│   └── social/   # Testimonios, CTA
└── shared/        # Componentes reutilizables, utils
```

## 🛠️ Comandos

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Lint
pnpm lint
```

## 🎨 Diseño

- Sistema de design tokens Apple (light/dark mode)
- Tipografía: SF Pro Text
- Colores semánticos: brand, surface, text, border, success, warning, error

## 📋 Features

- Catálogo con filtros (marca, modelo, precio, estado)
- Cards de producto con badges
- Página de detalle con galería + WhatsApp contextual
- UrgencyBanner tipo marquee
- Testimonios y sección de tienda
- Tema claro/oscuro
