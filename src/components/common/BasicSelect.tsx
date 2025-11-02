import { FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useId } from 'react';

export type BasicSelectProps = {
  placeholder?: string;
  required?: boolean;
  items: { label: string | ReactNode; value: string | number; disabled?: boolean }[];
  onChange: (value: string | number | null) => void;
  value?: string | number | null;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  allowEmpty?: boolean;
  id?: string;
  "aria-required"?: boolean;
};

export function BasicSelect({
  placeholder,
  required,
  items,
  onChange,
  value,
  disabled,
  className,
  helperText,
  allowEmpty = false,
  id,
  "aria-required": ariaRequired
}: BasicSelectProps) {
  const hasValue = value !== null && value !== undefined && value !== '';
  const descriptionId = useId();

  // Multi-select logic
  // Single-select (existing logic)
  return (
    <div className='w-full'>
      {helperText && <FormDescription id={descriptionId}>{helperText}</FormDescription>}
      <div className='relative'>
        <Select
          disabled={disabled}
          onValueChange={(val) => {
            // Always single-select: pass null if empty string, else value
            onChange(val === '' ? null : val);
          }}
          value={value?.toString() ?? ''}
          onOpenChange={(isOpen: boolean) => {
            if (!isOpen && !hasValue) {
              onChange(null);
            }
          }}
        >
          <SelectTrigger
            id={id}
            aria-required={ariaRequired}
            aria-describedby={helperText ? descriptionId : undefined}
            className={cn(
              'bg-transparent hover:bg-transparent focus:ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-neutral-700/60 w-full dark:bg-neutral-900 dark:text-white dark:border-neutral-700',
              allowEmpty && hasValue && 'pr-12',
              className
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className='dark:bg-neutral-900 dark:border-neutral-700'>
            <SelectGroup>
              {items.map(({ value, label, disabled }) => (
                <SelectItem
                  key={value}
                  value={value.toString()}
                  disabled={disabled}
                  className='dark:text-white dark:focus:bg-neutral-800 dark:focus:text-white'
                >
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {allowEmpty && hasValue && (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className='absolute right-2 top-1/2 -translate-y-1/2 hover:bg-neutral-100 dark:hover:bg-neutral-800 p-1.5 rounded-sm'
          >
            <X className='h-3.5 w-3.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50' />
          </button>
        )}
      </div>
    </div>
  );
}
