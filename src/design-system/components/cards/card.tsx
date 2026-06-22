/**
 * Grahvani Card Primitive
 *
 * The single source of truth for cards across the platform. Compose with
 * CardHeader, CardTitle, CardSubtitle, CardBody, CardFooter, and CardAction.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  cardVariantClasses,
  cardBodyClasses,
  cardHeaderClasses,
  cardFooterClasses,
  cardTitleClasses,
  cardSubtitleClasses,
  type CardVariant,
} from './card-system';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'base', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariantClasses[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, action, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardHeaderClasses, className)} {...props}>
        <div className="flex min-w-0 flex-col gap-1">{children}</div>
        {action ? <div className="flex shrink-0 items-center">{action}</div> : null}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return <h3 ref={ref} className={cn(cardTitleClasses, className)} {...props} />;
});
CardTitle.displayName = 'CardTitle';

export const CardSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return <p ref={ref} className={cn(cardSubtitleClasses, className)} {...props} />;
});
CardSubtitle.displayName = 'CardSubtitle';

export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(cardBodyClasses, className)} {...props} />;
});
CardBody.displayName = 'CardBody';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(cardFooterClasses, className)} {...props} />;
  }
);
CardFooter.displayName = 'CardFooter';

export const CardAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('flex shrink-0 items-center gap-2', className)} {...props} />;
});
CardAction.displayName = 'CardAction';
