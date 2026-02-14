# Simuladores Financieros

Aplicación web para proyecciones de inversión y simulación de deuda con prepagos.

## Características

- **Simulador de Inversión**: Calcula el crecimiento de inversiones con aportes periódicos e interés compuesto
- **Simulador de Deuda**: Proyecta cronogramas de amortización y permite simular prepagos (reducir plazo o cuota)
- **Temas**: Light y dark con persistencia en localStorage
- **Responsive**: Adaptada a móvil, tablet y desktop

## Tecnologías

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Material UI v5](https://mui.com/)
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/) para E2E

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
# Clonar e instalar dependencias
git clone <repo-url>
cd finanzas-personales
npm install
```

## Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Abrir http://localhost:3000
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Inicia el servidor de producción |
| `npm test` | Ejecuta tests unitarios |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run test:e2e` | Tests E2E con Playwright (ejecutar `npx playwright install` la primera vez) |
| `npm run lint` | Ejecuta ESLint |
| `npm run format` | Formatea código con Prettier |
| `npm run type-check` | Verificación de tipos TypeScript |

## Estructura del proyecto

```
src/
├── app/              # Páginas (App Router)
├── components/       # Componentes reutilizables
│   ├── common/       # Inputs, cards, etc.
│   └── layout/      # Header, menú, layout
├── domain/           # Lógica de negocio
│   ├── investment/   # Fórmulas y servicios de inversión
│   └── debt/         # Fórmulas y servicios de deuda
├── features/        # Componentes por feature
├── hooks/            # Custom hooks
├── theme/            # Configuración de temas
├── types/            # Tipos compartidos
└── utils/            # Utilidades

tests/
├── unit/             # Tests unitarios
└── integration/      # Tests de integración

e2e/                  # Tests E2E
```

## Core Web Vitals

Para verificar los objetivos de rendimiento (FCP < 3s, CLS < 0.1):

1. **Lighthouse** (Chrome DevTools):
   - Ejecuta `npm run build && npm run start`
   - Abre Chrome DevTools → Lighthouse
   - Ejecuta un reporte de Performance

2. **PageSpeed Insights**: https://pagespeed.web.dev/

## Licencia

MIT
