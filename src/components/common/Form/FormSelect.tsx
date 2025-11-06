'use client';

import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { BasicSelect } from '../BasicSelect';
import { useId } from 'react';
import { Label } from '@/components/ui/label';

export type FormSelectProps = {
  // eslint-disable-next-line
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  items: { label: string | React.ReactNode | number; value: string | number }[];
  className?: string;
  helperText?: string;
  allowEmpty?: boolean;
  required?: boolean;
};

export function FormSelect({
  control,
  name,
  label,
  placeholder,
  items,
  className,
  helperText,
  allowEmpty = false,
  required
}: FormSelectProps) {
  const id = useId();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {label && <Label htmlFor={id}>{label}</Label>}
            <FormControl>
              <BasicSelect
                id={id}
                items={items}
                disabled={field.disabled}
                className={className}
                helperText={helperText}
                required={required}
                placeholder={placeholder}
                value={field.value}
                onChange={field.onChange}
                allowEmpty={allowEmpty}
                aria-required={required}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
