import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { CardVariant, BaseComponentProps } from '@/types';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hover = false,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'bg-white rounded-xl transition-all duration-200 overflow-hidden';

    const variantClasses = {
      default: 'border border-gray-200',
      outlined: 'border-2 border-gray-200',
      elevated: 'shadow-lg border border-gray-100',
    };

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverClasses = hover
      ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          hoverClasses,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

// Card 하위 컴포넌트들
interface CardHeaderProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mb-4', className)} {...props}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        )}
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        {children}
      </div>
    );
  },
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps extends BaseComponentProps {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    );
  },
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends BaseComponentProps {
  align?: 'left' | 'center' | 'right';
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'right', children, ...props }, ref) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mt-6 flex items-center gap-2',
          alignClasses[align],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = 'CardFooter';

// 내보내기
export { Card, CardHeader, CardContent, CardFooter };
export default Card;
