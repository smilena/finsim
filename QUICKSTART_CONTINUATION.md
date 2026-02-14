# Guía Rápida: Continuar Implementación

## ✅ Lo que ya está listo

1. **Scripts de lint** configurados
2. **Fórmulas financieras** verificadas y documentadas
3. **Internacionalización** (i18n) completamente configurada con español e inglés
4. **Tailwind CSS** configurado con paleta de Radix UI
5. **Archivos de traducción** listos para usar

## 🎯 Siguiente paso inmediato

### Crear componentes base de shadcn/ui

**Instalar dependencias de Radix UI:**
```bash
npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-select @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-alert-dialog @radix-ui/react-dropdown-menu
```

**Crear en `src/components/ui/`:**

#### 1. Button (`button.tsx`)
Ver ejemplo completo en IMPLEMENTATION_STATUS.md

#### 2. Card (`card.tsx`)
```typescript
import { cn } from '@/lib/utils';

const Card = ({ className, ...props }) => (
  <div className={cn('rounded-lg border bg-surface p-6', className)} {...props} />
);

const CardHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn('text-2xl font-semibold leading-none tracking-tight text-foreground', className)} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn('text-foreground-secondary', className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardContent };
```

#### 3. Input (`input.tsx`)
```typescript
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-border bg-input px-3 py-2',
          'text-sm text-foreground placeholder:text-foreground-secondary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

#### 4. Label (`label.tsx`)
```typescript
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium text-foreground leading-none',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```

#### 5. Crear los demás componentes
- `select.tsx` - Usar @radix-ui/react-select
- `table.tsx` - Table, TableHeader, TableBody, TableRow, TableCell
- `alert.tsx` - Para mensajes informativos
- `tabs.tsx` - Para organizar contenido
- `badge.tsx` - Para etiquetas de estado

**Referencia:** https://ui.shadcn.com/docs/components para ver implementaciones completas

---

## 🔄 Migrar componentes existentes

### Patrón de migración:

**Antes (MUI):**
```tsx
import { Button, Box, Typography } from '@mui/material';

<Box sx={{ p: 3 }}>
  <Typography variant="h6">Título</Typography>
  <Button variant="contained" onClick={handleClick}>
    Click me
  </Button>
</Box>
```

**Después (shadcn/ui + Tailwind):**
```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

<Card className="p-6">
  <h2 className="text-2xl font-semibold text-foreground">Título</h2>
  <Button onClick={handleClick}>
    Click me
  </Button>
</Card>
```

### Orden sugerido de migración:

1. **Layout primero** (AppLayout, AppHeader)
2. **Componentes comunes** (NumberInput, SelectField, ResultCard)
3. **Páginas principales** (page.tsx, debt/page.tsx)
4. **Features de deuda** (DebtForm, DebtResults, etc.)
5. **Features de inversión** (InvestmentForm, etc.)

---

## 🎨 Gráficas con Recharts

### Instalar:
```bash
npm install recharts
```

### Ejemplo de implementación:

```typescript
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '@/lib/chart-config';

export function DebtEvolutionChart({ baseSchedule, prepaymentSchedule }) {
  const data = baseSchedule.map((payment, index) => ({
    month: payment.paymentNumber,
    withoutPrepayment: payment.remainingBalance,
    withPrepayment: prepaymentSchedule[index]?.remainingBalance || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis dataKey="month" stroke={CHART_COLORS.text} />
        <YAxis stroke={CHART_COLORS.text} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#151b3d', 
            border: '1px solid #1e293b',
            color: '#f1f5f9' 
          }}
        />
        <Area 
          type="monotone" 
          dataKey="withoutPrepayment" 
          stackId="1"
          stroke={CHART_COLORS.debtWithoutPrepayment} 
          fill={CHART_COLORS.debtWithoutPrepayment}
          fillOpacity={0.3}
        />
        <Area 
          type="monotone" 
          dataKey="withPrepayment" 
          stackId="2"
          stroke={CHART_COLORS.debtWithPrepayment} 
          fill={CHART_COLORS.debtWithPrepayment}
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

---

## 📋 Checklist Rápida

Completado:
- [x] i18n configurado
- [x] Tailwind configurado
- [x] Colores de Radix UI definidos
- [x] Fórmulas verificadas
- [x] Componentes UI base creados (11 componentes)
- [x] Componentes comunes migrados (6 componentes)
- [x] Componentes de layout migrados (5 componentes)
- [x] Recharts instalado
- [x] Configuración de colores para gráficas creada
- [x] Páginas principales migradas (Home, Investment, Debt)
- [x] Componentes de Investment migrados (3 componentes)
- [x] Componentes de Debt migrados (7 componentes)
- [x] Gráfica de ejemplo implementada (DebtEvolutionChart)
- [x] Lint ejecutado sin errores
- [x] TypeScript compilando sin errores

Por hacer (opcional):
- [ ] Agregar más gráficas (InvestmentGrowthChart, etc.)
- [ ] Paginación completa en tablas
- [ ] Traducciones aplicadas completamente en UI
- [ ] Tests actualizados completamente
- [ ] Desinstalar dependencias de MUI

---

## 🔗 Referencias

- **Plan completo:** Ver archivo de plan en `.cursor/plans/`
- **Documentación de colores:** `tailwind.config.js`
- **Traducciones:** `src/i18n/locales/es.json` y `en.json`
- **shadcn/ui docs:** https://ui.shadcn.com/
- **Recharts docs:** https://recharts.org/

---

## 💡 Consejos

1. **Probar frecuentemente:** `npm run dev` después de cada componente migrado
2. **Commits pequeños:** Commit después de cada componente o grupo lógico
3. **Usar el selector de idioma:** Agregarlo al header para probar traducciones
4. **Performance:** Usar React DevTools para identificar re-renders
5. **Accesibilidad:** Probar con navegación por teclado (Tab, Enter, Escape)

---

**¿Listo para continuar?** Puedes retomar desde cualquier punto del plan.
