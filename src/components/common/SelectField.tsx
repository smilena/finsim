/**
 * Select/dropdown field component
 */

'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Current value
   */
  value: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Available options
   */
  options: SelectOption[];

  /**
   * Optional error message
   */
  error?: string;

  /**
   * Optional helper text
   */
  helperText?: string;

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
 * Select dropdown with validation
 */
export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
}: SelectFieldProps) {
  const selectId = `select-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      <Label htmlFor={selectId}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={selectId}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          className={cn(error && 'border-destructive focus:ring-destructive')}
        >
          <SelectValue placeholder={`Selecciona ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p id={`${selectId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${selectId}-helper`} className="text-sm text-foreground-secondary">
          {helperText}
        </p>
      )}
    </div>
  );
}
