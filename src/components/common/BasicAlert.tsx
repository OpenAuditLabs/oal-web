import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { MdErrorOutline } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Defines the visual variants available for the BasicAlert component.
 * These variants correspond to different semantic meanings (e.g., informational, success, error).
 */
type BasicAlertVariant = 'info' | 'success' | 'error';

/**
 * Props for the BasicAlert component.
 */
interface BasicAlertProps {
  /**
   * The visual variant of the alert, determining its styling.
   * @default 'info'
   */
  variant?: BasicAlertVariant;
  /**
   * The title of the alert, displayed in a prominent way.
   */
  title?: string;
  /**
   * The main descriptive content of the alert.
   */
  description: string;
  /**
   * Optional CSS class names to apply to the alert container.
   */
  className?: string;
  /**
   * Callback function to be called when the close button is clicked.
   * If provided, a close button will be rendered.
   */
  onClose?: () => void;
}

/**
 * A basic alert component that displays a message with an optional title,
 * an icon based on its variant, and an optional close button.
 * It leverages the shared UI Alert component for consistent styling.
 *
 * @example
 * <BasicAlert variant="error" title="Submission Error" description="Your submission could not be processed." />
 * <BasicAlert variant="success" description="Your changes have been saved." onClose={() => console.log('Alert closed')} />
 */
export function BasicAlert({
  variant = 'info',
  title,
  description,
  className,
  onClose,
}: BasicAlertProps) {
  const Icon = {
    info: IoIosInformationCircleOutline,
    success: FaCheckCircle,
    error: MdErrorOutline,
  }[variant];

  return (
    <Alert role="alert" variant={variant} className={className}>
      <Icon size={18} aria-hidden="true" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{description}</AlertDescription>
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-6 w-6 text-foreground/50 hover:bg-transparent hover:text-foreground"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </Alert>
  );
}

