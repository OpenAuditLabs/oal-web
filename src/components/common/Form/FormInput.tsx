import { Control, FieldValues, Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField } from '@/components/ui/form';
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

  max,

  id,

  autoFocus

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

  id?: string;

  autoFocus?: boolean;

}) {

  return (

    <FormField

      control={control}

      name={name}

            render={({ field, formState }) => {

              const { formDescriptionId, formMessageId } = useFormField();

              return (

                <FormItem className='space-y-1'>

                  <FormLabel htmlFor={id}>

                    {label} {required && <span className='text-red-500'>*</span>}

                  </FormLabel>

                  {helperText && <FormDescription>{helperText}</FormDescription>}

                  <div className='flex flex-row gap-1 items-center'>

                    <FormControl>

                      <Input

                        placeholder={placeholder}

                        {...field}

                        value={field.value ?? ''}

                        min={min}

                        max={max}

                        step={step}

                        onChange={(e) => {

                          if (type === 'number') {

                            const str = e.currentTarget.value;

                            if (str === '') {

                              field.onChange(null);

                            } else {

                              const num = e.currentTarget.valueAsNumber;

                              field.onChange(Number.isNaN(num) ? null : num);

                            }

                          } else {

                            field.onChange(e.target.value);

                          }

                        }}

                        type={type}

                        required={required}

                        id={id}

                        autoFocus={autoFocus}

                        aria-invalid={!!formState.errors[name]}

                        aria-describedby={

                          formState.errors[name]

                            ? formMessageId

                            : helperText

                              ? formDescriptionId

                              : undefined

                        }

                      />

                    </FormControl>

                    {endComponent}

                  </div>

                  

                  <div style={{ minHeight: '1em' }}>

                    <FormMessage />

                  </div>

                </FormItem>

              );

            }}
    />
  );
}
