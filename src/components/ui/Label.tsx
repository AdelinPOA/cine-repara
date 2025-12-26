import { LabelHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block text-sm font-medium text-gray-700 mb-1.5',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';

export { Label };
