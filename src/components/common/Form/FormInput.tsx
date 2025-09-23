import { Control, FieldValues, Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { HTMLInputTypeAttribute } from 'react';

export function FormInput<T extends FieldValues>({
  placeholder,
  control,
  name,
  label,
  type = 'text',
  required = false,
  helperText,
  endComponent,
  min,
  step,
  max
}: {
  max?: number; // Optional min value for number inputs
  step?: number; // Optional step value for number inputs
  label: string;
  placeholder?: string;
  control: Control<T>;
  name: Path<T>;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  helperText?: string;
  endComponent?: React.ReactNode;
  min?: number; // Optional min value for number inputs
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-2'>
          <FormLabel>
            {label} {required && <span className='text-red-500'>*</span>}
          </FormLabel>
          <div className='flex flex-row gap-2 items-center'>
            <FormControl>
              <Input
                placeholder={placeholder}
                {...field}
                min={min}
                max={max}
                step={step}
                onChange={(e) => {
                  if (type === 'number') {
                    const value = e.target.value;
                    if (value === '' || value === null || value === undefined) {
                      field.onChange(null);
                    } else {
                      const num = Number(value.trim());
                      if (Number.isNaN(num)) {
                        field.onChange(null);
                        // Optionally, set an error here if you want to show a message
                      } else {
                        field.onChange(num);
                      }
                    }
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
                type={type}
                required={required}
              />
            </FormControl>
            {endComponent}
          </div>
          {helperText && <div className='text-sm text-gray-500 dark:text-gray-400 my-1'>{helperText}</div>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
