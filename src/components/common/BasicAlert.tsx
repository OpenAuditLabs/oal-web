import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { MdCheckCircleOutline, MdErrorOutline } from 'react-icons/md';
import { cn } from '@/lib/utils';

interface BasicAlertProps {
  variant?: 'info' | 'success' | 'error';
  title?: string;
  description: string;
  className?: string;
}

export function BasicAlert({
  variant = 'info',
  title,
  description,
  className,
}: BasicAlertProps) {
  const variantMap = {
    info: {
      alertVariant: 'default',
      icon: <IoIosInformationCircleOutline size={18} aria-hidden="true" />,
      className: 'text-blue-500',
    },
    success: {
      alertVariant: 'default',
      icon: <MdCheckCircleOutline size={18} aria-hidden="true" />,
      className: 'text-green-500',
    },
    error: {
      alertVariant: 'destructive',
      icon: <MdErrorOutline size={18} aria-hidden="true" />,
      className: 'text-red-500',
    },
  };

  const currentVariant = variantMap[variant];

  return (
    <Alert role="alert" variant={currentVariant.alertVariant} className={cn(currentVariant.className, className)}>
      {currentVariant.icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

/**
 * @example
 * <BasicAlert variant="info" title="Heads up!" description="You are logged in." />
 */
