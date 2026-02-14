/**
 * Number input component with validation
 */

'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { NumericConstraint } from '@/types/common.types';

export interface NumberInputProps {
  /**
   * Input label
   */
  label: string;

  /**
   * Current value
   */
  value: number;

  /**
   * Change handler
   */
  onChange: (value: number) => void;

  /**
   * Optional error message
   */
  error?: string;

  /**
   * Optional helper text
   */
  helperText?: string;

  /**
   * Numeric constraints (min, max, decimals)
   */
  constraints?: NumericConstraint;

  /**
   * Optional prefix (e.g., "$")
   */
  prefix?: string;

  /**
   * Optional suffix (e.g., "%")
   */
  suffix?: string;

  /**
   * Whether field is required
   * @default false
   */
  required?: boolean;

  /**
   * Whether field is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Full width
   * @default true
   */
  fullWidth?: boolean;
}

/**
 * Number input with validation and formatting
 */
export function NumberInput({
  label,
  value,
  onChange,
  error,
  helperText,
  constraints,
  prefix,
  suffix,
  required = false,
  disabled = false,
  fullWidth = true,
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = React.useState<string>(value.toString());

  // Sync display value when external value changes
  React.useEffect(() => {
    setDisplayValue(value.toString());
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stringValue = event.target.value;
    setDisplayValue(stringValue);

    // If empty, don't call onChange to avoid defaulting to 0
    if (stringValue === '') {
      return;
    }

    const numericValue = parseFloat(stringValue);

    // Only propagate valid numbers
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  };

  const handleBlur = () => {
    // On blur, if empty or invalid, restore to last valid value
    if (displayValue === '' || isNaN(parseFloat(displayValue))) {
      setDisplayValue(value.toString());
    }
  };

  const inputId = `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      <Label htmlFor={inputId}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary text-sm">
            {prefix}
          </span>
        )}
        <Input
          id={inputId}
          type="number"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          min={constraints?.min}
          max={constraints?.max}
          step={constraints?.step || 0.01}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive',
            prefix && 'pl-8',
            suffix && 'pr-8'
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary text-sm">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-sm text-foreground-secondary">
          {helperText}
        </p>
      )}
    </div>
  );
}
