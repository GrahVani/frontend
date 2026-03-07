import { cn } from '@/lib/utils';

type ContainerVariant = 'standard' | 'wide' | 'narrow' | 'form';

const VARIANT_CLASSES: Record<ContainerVariant, string> = {
    standard: 'max-w-[1600px]',
    wide: 'max-w-[1920px]',
    narrow: 'max-w-3xl',
    form: 'max-w-4xl',
};

interface PageContainerProps {
    children: React.ReactNode;
    variant?: ContainerVariant;
    className?: string;
}

export default function PageContainer({
    children,
    variant = 'standard',
    className,
}: PageContainerProps) {
    return (
        <div className={cn('mx-auto w-full', VARIANT_CLASSES[variant], className)}>
            {children}
        </div>
    );
}
