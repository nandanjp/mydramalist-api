import { cn } from "@/lib/utils";

interface HeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const HeaderOne = ({ children, className }: HeaderProps) => (
    <h1
        className={cn(
            "scroll-m-20 children-4xl font-extrabold tracking-tight lg:children-5xl",
            className
        )}
    >
        {children}
    </h1>
);
export const HeaderTwo = ({ children, className }: HeaderProps) => (
    <h2
        className={cn(
            "scroll-m-20 children-3xl font-semibold tracking-tight transition-colors first:mt-0",
            className
        )}
    >
        {children}
    </h2>
);
export const HeaderThree = ({ children, className }: HeaderProps) => (
    <h3
        className={cn(
            "scroll-m-20 children-2xl font-semibold tracking-tight",
            className
        )}
    >
        {children}
    </h3>
);
export const Paragraph = ({ children, className }: HeaderProps) => (
    <p className={cn("leading-7", className)}>{children}</p>
);
export const Blockquote = ({ children, className }: HeaderProps) => (
    <blockquote className={cn("border-l-2 pl-6 italic", className)}>
        {children}
    </blockquote>
);
