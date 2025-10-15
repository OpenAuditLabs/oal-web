import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { MdErrorOutline } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa'; // For success variant

type BasicAlertVariant = 'info' | 'success' | 'error';

  // Example usage:
  // <BasicAlert variant="error" title="Submission Error" description="Your submission could not be processed." />
  // <BasicAlert variant="success" description="Your changes have been saved." />

export function BasicAlert({
  variant = 'info',
  title,
  description,
  className,
}: {
  variant?: BasicAlertVariant;
  title?: string;
  description: string;
  className?: string;
}) {
  const variantClasses = {
    info: 'bg-blue-50 text-blue-800',
    success: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
  };

  const Icon = {
    info: IoIosInformationCircleOutline,
    success: FaCheckCircle,
    error: MdErrorOutline,
  }[variant];

  return (
    <Alert role="alert" className={`${variantClasses[variant]} ${className || ''}`}>
      <Icon size={18} aria-hidden="true" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

