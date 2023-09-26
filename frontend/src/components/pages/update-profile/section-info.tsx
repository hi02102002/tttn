import { cn } from '@/lib/utils';

export const SectionInfo = ({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) => {
   return (
      <div
         className={cn('border border-border rounded bg-background', className)}
      >
         {children}
      </div>
   );
};

export const SectionInfoTitle = ({ title }: { title: string }) => {
   return <p className="text-lg font-semibold">{title}</p>;
};

export const SectionBody = ({ children }: { children: React.ReactNode }) => {
   return <div className="p-4">{children}</div>;
};

export const SectionInfoDescription = ({
   description,
}: {
   description: string;
}) => {
   return <p className="text-muted-foreground">{description}</p>;
};

export const SectionInfoFooter = ({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) => {
   return (
      <div
         className={cn(
            'flex items-center justify-between p-4 gap-4 border-t border-border',
            className
         )}
      >
         {children}
      </div>
   );
};
