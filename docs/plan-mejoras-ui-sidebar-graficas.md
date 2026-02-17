# Plan: Mejoras UI – Gráficas/Tablas 390px, Sidebar y Mobile

## Resumen

Este documento describe el plan para:

1. Evitar scroll horizontal en viewport ~390px en gráficas y tablas.
2. Añadir división visual entre selector de idioma (banderas) y el icono de tema.
3. Que el sidebar solo se expanda/contraiga con la flecha inferior, no al usar los iconos de la derecha.
4. Hacer más amigable el control de abrir/cerrar el sidebar.
5. En mobile: mantener solo el icono de hamburguesa (sin X) y usar el mismo icono para abrir y cerrar.
6. Unificar el degradado (gradient) como en las cards inferiores de cada página y hacerlos un poco más visibles.

---

## 1. Ajustar tamaño a ~390px – Sin scroll horizontal en gráficas y tablas

### Problema
En viewports pequeños (~390px), al mostrar gráficas (Recharts) y tablas, aparece scroll horizontal en la página.

### Causas identificadas
- **Contenedor principal**: `container mx-auto min-w-0 max-w-full px-3 min-[400px]:px-4` — a 390px el ancho útil es ~342px (390 - 2×24px). Si algún hijo tiene `min-width` implícito o no tiene `min-w-0`, puede forzar ancho y provocar scroll.
- **Tablas**: `Table` envuelve en `<div className="relative w-full overflow-auto">`. Ese scroll es interno; si el contenedor padre no limita bien el ancho, la tabla puede empujar el layout.
- **Gráficas**: `ResponsiveContainer width="100%"` depende del padre. Los wrappers usan `min-w-0 w-full` pero la cadena de contenedores (páginas, cards) debe ser consistente.
- **Cards**: Sin `min-w-0`/`overflow-hidden` en la cadena, el contenido puede desbordar.

### Tareas

| # | Tarea | Archivos | Acción |
|---|--------|----------|--------|
| 1.1 | Contenedor de contenido principal | `AppLayout.tsx` | Asegurar que el wrapper del `main` tenga `overflow-x-hidden` o que el div con `container` tenga `min-w-0 max-w-full` (ya tiene). Revisar que no haya márgenes/ paddings que sumen y superen 100vw. |
| 1.2 | Páginas (debt, investment) | `app/debt/page.tsx`, `app/investment/page.tsx` | Mantener/asegurar que el contenedor de la página tenga `min-w-0 max-w-full` y, si hace falta, `overflow-x-hidden` en el contenedor que envuelve gráficas y tablas. |
| 1.3 | Wrappers de gráficas | `DebtEvolutionChart.tsx`, `InterestSavingsChart.tsx`, `InvestmentProfitabilityChart.tsx` | El contenedor del chart debe tener `min-w-0 max-w-full` (o `w-full max-w-full`) y el padre (p. ej. `CardContent`) también `min-w-0` para que el flex no impida encoger. |
| 1.4 | Cards que envuelven gráficas/tablas | `card.tsx` o uso en features | En los `Card`/`CardContent` que envuelven gráficas o tablas, añadir `min-w-0` y opcionalmente `overflow-hidden` en `CardContent` para que el contenido no desborde. |
| 1.5 | Tablas | `AmortizationTable.tsx`, `InvestmentBreakdownTable.tsx`, `table.tsx` | El wrapper de la tabla ya tiene `overflow-auto`. Asegurar que el contenedor inmediato (p. ej. el `div` con `min-w-0 max-w-full` en cada feature) sea el que limita el ancho. Opcional: en viewports pequeños, reducir padding de celdas (`TableCell`/`TableHead`) con clases responsive (p. ej. `px-2 sm:px-4`) para que quepan mejor. |
| 1.6 | Recharts en 390px | Componentes de chart | Comprobar que `ResponsiveContainer` esté dentro de un nodo con ancho definido y `min-w-0`. Si hace falta, usar `minWidth={0}` en el contenedor del chart para forzar que flex permita encoger. |

### Criterio de éxito
- En viewport 390px (y hasta 320px), no debe aparecer scroll horizontal al mostrar gráficas y tablas.
- El scroll, si existe, debe quedar contenido dentro del bloque de la tabla (overflow interno), no en la página.

---

## 2. División entre banderas (idioma) y icono de tema

### Objetivo
Diferenciar claramente el selector de idioma del botón de tema: **selector de idioma (banderas) → división visual → icono de tema**.

### Tareas

| # | Tarea | Archivos | Acción |
|---|--------|----------|--------|
| 2.1 | Sustituir botones de banderas por Select | `AppSidebar.tsx` | Usar un `Select` (o el componente `LanguageSelector` existente si encaja) para idioma: valor actual = bandera + nombre (ej. 🇪🇸 Español). En modo colapsado, mostrar solo la bandera actual en un trigger compacto. |
| 2.2 | Añadir división | `AppSidebar.tsx` | Entre el selector de idioma y `ThemeToggle`: añadir un divisor vertical (desktop) u horizontal (sidebar colapsado). Por ejemplo: `<div className="h-6 w-px bg-border" />` (vertical) o `<div className="w-full h-px bg-border" />` (horizontal cuando esté en columna). |
| 2.3 | Estilos en colapsado | `AppSidebar.tsx` | En `collapsed && !compact`, mantener el orden: [Select idioma] → divisor → [ThemeToggle]. Si el Select en colapsado es solo icono/bandera, el divisor puede ser una línea vertical entre bandera y tema. |

### Opciones de implementación
- **Opción A**: Reutilizar `LanguageSelector` en el sidebar (dropdown con bandera + nombre). Añadir prop `compact` para vista solo bandera cuando el sidebar esté colapsado.
- **Opción B**: Implementar un `Select` nativo en `AppSidebar` con opciones ES/EN mostrando bandera + etiqueta, y en colapsado un trigger que muestre solo la bandera del idioma actual.

---

## 3. Sidebar: solo expandir/contraer con la flecha inferior

### Objetivo
Al hacer clic en los iconos de la derecha (idioma, tema) **no** debe cambiar el estado expandido/colapsado del sidebar. Solo el botón de la flecha (chevron) debe expandir o contraer.

### Estado actual
- En `AppSidebar.tsx`, el toggle de collapse solo se dispara con el `Button` que tiene `onToggleCollapse`. Los botones de idioma y `ThemeToggle` no llaman a `onToggleCollapse`.
- Si en algún lugar (p. ej. desktop) hubiera “expand on hover” o “expand on focus”, habría que desactivarlo.

### Tareas

| # | Tarea | Archivos | Acción |
|---|--------|----------|--------|
| 3.1 | Revisar triggers de expansión | `AppLayout.tsx`, `AppSidebar.tsx` | Confirmar que no exista lógica que expanda el sidebar al hacer foco o clic en el área de idioma/tema. Si la hubiera, eliminarla. |
| 3.2 | Aislar clics en footer | `AppSidebar.tsx` | Asegurar que los clics en el selector de idioma y en `ThemeToggle` no propaguen a ningún handler que altere el estado de collapse. No usar `onClick` en un contenedor que también dispare expand. |
| 3.3 | Mobile (Sheet) | `AppLayout.tsx` | En mobile el “sidebar” es un Sheet; su apertura/cierre es independiente (toggle del hamburguesa). Este punto se refiere sobre todo al sidebar **desktop** colapsado (solo iconos): que al hacer clic en banderas o tema no se expanda. |

### Criterio de éxito
- Desktop: sidebar colapsado → clic en bandera o tema → no se expande; solo al clic en la flecha se expande/contrae.

---

## 4. Flecha de abrir/cerrar sidebar más amigable

### Objetivo
Hacer más claro y usable el control que abre y cierra (expandir/contraer) el sidebar.

### Opciones a valorar

| Opción | Descripción | Pros | Contras |
|--------|-------------|------|--------|
| A | Mantener chevron pero con etiqueta/tooltip | Añadir `title` o tooltip “Expandir menú” / “Contraer menú” y asegurar `aria-label`. | Fácil, accesible. | Sigue siendo solo una flecha. |
| B | Icono más explícito | Usar `PanelLeftClose` / `PanelLeftOpen` (lucide-react) en lugar de ChevronLeft/Right. | Más semántico. | Ocupa un poco más de espacio. |
| C | Botón tipo “pill” con texto | En modo expandido: “[←] Contraer”; en colapsado: “Expandir [→]”. | Muy claro. | Requiere más espacio; en colapsado solo cabría icono. |
| D | Posición y estilo | Dejar chevron pero mejorar contraste (borde, fondo suave) y posición fija al pie del sidebar para que sea siempre visible. | Mejor descubribilidad. | Cambio visual moderado. |

### Tareas recomendadas

| # | Tarea | Archivos | Acción |
|---|--------|----------|--------|
| 4.1 | Tooltip/aria | `AppSidebar.tsx` | Garantizar `aria-label` correcto (ej. “Expandir menú” / “Contraer menú”) y, si hay componente Tooltip en el proyecto, usarlo en el botón de la flecha. |
| 4.2 | Icono alternativo (opcional) | `AppSidebar.tsx` | Probar `PanelLeftClose` / `PanelLeftOpen` en lugar de chevrons y valorar con diseño. |
| 4.3 | Estilo del botón | `AppSidebar.tsx` | Dar al botón un estilo que lo diferencie (p. ej. `variant="outline"`, borde discreto o fondo muted) para que se perciba como control principal del sidebar. |

---

## 5. Mobile: solo hamburguesa, sin X; abrir y cerrar con el mismo icono

### Objetivo
- En mobile, **no** mostrar el botón X para cerrar el menú.
- Tanto abrir como cerrar el menú se hace con el **mismo icono de hamburguesa** (toggle).

### Estado actual
- `sheet.tsx`: `SheetContent` renderiza por defecto un `DialogPrimitive.Close` con icono `X` (líneas 55–59).
- `AppLayout.tsx`: en mobile se muestra un header con `Menu` (hamburguesa) que llama a `toggleMenu`; el Sheet se cierra con `onOpenChange` cuando `open === false`.

### Tareas

| # | Tarea | Archivos | Acción |
|---|--------|----------|--------|
| 5.1 | Ocultar el botón X en el Sheet del menú | `sheet.tsx` o `AppLayout.tsx` | **Opción A**: Añadir a `SheetContent` una prop opcional `hideCloseButton?: boolean`. Cuando sea `true`, no renderizar el `DialogPrimitive.Close` con la X. **Opción B**: Crear un componente `SheetContentWithoutClose` o variante `sidebar` que no incluya el cierre, y usarlo solo para el menú mobile en `AppLayout`. Se recomienda Opción A para no duplicar lógica. |
| 5.2 | Usar la prop en el layout mobile | `AppLayout.tsx` | Al usar `SheetContent` para el menú lateral (mobile), pasar `hideCloseButton={true}` (o el nombre que se elija) para que no se muestre la X. |
| 5.3 | Cerrar solo con hamburguesa | Ya implementado | El cierre ya puede hacerse con `toggleMenu()` (otro clic en hamburguesa). Verificar que al hacer clic en el icono de hamburguesa con el Sheet abierto, se llame a `toggleMenu` y se cierre. No añadir otro botón de cierre dentro del Sheet para mobile. |
| 5.4 | Cierre al navegar (opcional) | `AppSidebar.tsx` | Ya existe `onClose` en los `Link` del sidebar (`onClick={onClose}`), de modo que al elegir una ruta se cierra el Sheet. Mantener este comportamiento. |

### Criterio de éxito
- En mobile no se ve la X en el Sheet del menú.
- Abrir: clic en hamburguesa → Sheet abre.
- Cerrar: clic de nuevo en hamburguesa → Sheet cierra (y/o al hacer clic en un enlace del menú).

---

## 6. Degradado en cards (estilo cards inferiores) y mayor visibilidad

### Objetivo
- Aplicar el mismo tipo de degradado que usan las cards inferiores (resultados, comparación) de cada página a las cards que corresponda, para una apariencia coherente.
- Hacer los degradados un poco más visibles (sin pasarse), para que se perciban mejor sin restar legibilidad.

### Estado actual
- **Card base** (`card.tsx`): `bg-gradient-to-br from-surface to-muted/30` — degradado suave surface → muted.
- **ResultCard** (cards de resultados en debt/investment): sobrescribe con `from-surface to-success/10`, `to-warning/10`, `to-info/10`, `to-primary/10` según variante (opacidad 10 %).
- **ComparisonCard** (debt): `bg-gradient-to-br from-surface via-surface to-success/10`.
- **Home** (`page.tsx`): usa Card base (hereda el degradado `to-muted/30`).

Los degradados con `/10` son muy sutiles; el de la Card base con `to-muted/30` es algo más visible.

### Tareas

| # | Tarea | Archivos | Acción |
|---|--------|----------|--------|
| 6.1 | Aumentar visibilidad de degradados en ResultCard | `ResultCard.tsx` | Subir opacidad del color final del degradado: de `to-success/10`, `to-warning/10`, etc. a algo como `to-success/15` o `to-success/20` (probar en ambos temas). Opcional: usar `via-surface` para un degradado en dos pasos y que se note un poco más. |
| 6.2 | Aumentar visibilidad en ComparisonCard | `ComparisonCard.tsx` | De `to-success/10` a `to-success/15` o `to-success/20` para que el degradado sea más visible. |
| 6.3 | Card base: degradado un poco más visible | `card.tsx` | Si se quiere coherencia con el resto, considerar subir `to-muted/30` a `to-muted/40` o `to-muted/50` para que el degradado de las cards genéricas se note un poco más. |
| 6.4 | Aplicar degradado a cards que no lo tengan | Páginas y features | Revisar qué cards de cada página usan solo la Card base y cuáles ya tienen degradado. Opcional: en home, las dos cards de acceso (Inversiones / Deudas) ya tienen el degradado base; si se desea el mismo estilo “con color” que las cards inferiores, se podría dar una variante suave (p. ej. primary o secondary) a esas cards. |
| 6.5 | Consistencia de patrón | Toda la app | Mantener el patrón `bg-gradient-to-br from-surface [via-surface] to-{color}/{opacity}` en todas las cards con degradado para que el estilo sea uniforme. Documentar en el plan o en comentarios el valor de opacidad elegido (ej. 15–20 para variantes, 40–50 para muted). |

### Opciones de visibilidad (valores de referencia)
- **Muy sutil (actual)**: `to-{color}/10`, `to-muted/30`.
- **Un poco más visible**: `to-{color}/15` o `to-{color}/20`, `to-muted/40` o `to-muted/50`.
- **Más marcado**: `to-{color}/25`, `to-muted/60` — comprobar contraste y legibilidad en tema claro y oscuro.

### Criterio de éxito
- Las cards inferiores (ResultCard, ComparisonCard) y las que deban seguir el mismo estilo usan degradado consistente.
- El degradado se percibe claramente sin resultar molesto ni reducir la legibilidad del texto.

---

## Orden sugerido de implementación

1. **Fase 1 – Mobile (rápido y acotado)**  
   - 5.1, 5.2: prop `hideCloseButton` en Sheet y uso en AppLayout.  
   - Verificar 5.3 y 5.4.

2. **Fase 2 – Sidebar desktop**  
   - 3.1–3.3: asegurar que solo la flecha expande/contrae.  
   - 2.1–2.3: Select de idioma + divisor + tema.  
   - 4.1–4.3: flecha más amigable (tooltip, icono, estilo).

3. **Fase 3 – Gráficas y tablas 390px**  
   - 1.1–1.2: contenedores de layout y páginas.  
   - 1.3–1.4: wrappers y cards de gráficas.  
   - 1.5–1.6: tablas y Recharts.  
   - Pruebas en 390px y 320px.

4. **Fase 4 – Degradados en cards**  
   - 6.1–6.2: subir opacidad en ResultCard y ComparisonCard.  
   - 6.3: opcional, Card base más visible.  
   - 6.4–6.5: revisar consistencia y documentar patrón.

---

## Archivos principales afectados

| Archivo | Cambios |
|---------|--------|
| `src/components/layout/AppLayout.tsx` | Sheet sin X en mobile (prop), posible revisión de padding/overflow. |
| `src/components/layout/AppSidebar.tsx` | Select idioma, divisor, ThemeToggle; solo flecha para collapse; mejora del botón de flecha. |
| `src/components/ui/sheet.tsx` | Prop `hideCloseButton` (o similar) para no mostrar el botón X. |
| `src/app/debt/page.tsx`, `src/app/investment/page.tsx` | Contenedores con `min-w-0`/`max-w-full`/`overflow-x` para evitar scroll horizontal. |
| `src/features/debt/*Chart.tsx`, `src/features/investment/*Chart.tsx` | Wrappers con `min-w-0`/`max-w-full`; revisión de padres (Card/CardContent). |
| `src/features/debt/AmortizationTable.tsx`, `src/features/investment/InvestmentBreakdownTable.tsx` | Contenedores y posible padding responsive en celdas. |
| `src/components/ui/card.tsx` y/o `src/components/ui/table.tsx` | Ajustes menores si hace falta para overflow en móvil. |
| `src/components/common/ResultCard.tsx` | Degradados más visibles (opacidad 15–20). |
| `src/features/debt/ComparisonCard.tsx` | Degradado más visible (`to-success/15` o `/20`). |

---

## Notas

- Todas las cadenas visibles para el usuario (tooltips, aria-labels, opciones del Select) deberían pasarse por i18n (`t('...')`) usando las claves en `src/i18n/locales/`.
- Probar en viewport 390px (y 320px) para gráficas y tablas, y en mobile real o emulación para el Sheet y el hamburguesa.
- Revisar degradados en tema claro y oscuro para asegurar que la opacidad elegida no afecte la legibilidad.
