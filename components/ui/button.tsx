import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "flame" | "ink" | "outline" | "ghost";
type Size = "sm" | "md" | "lg" | "xl";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClass: Record<Variant, string> = {
  flame: "btn-flame",
  ink: "btn-ink",
  outline: "btn-outline-ink",
  ghost: "btn-ghost",
};

const sizeClass: Record<Size, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  xl: "btn-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "flame", size = "md", ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(variantClass[variant], sizeClass[size], className)}
      {...rest}
    />
  ),
);
Button.displayName = "Button";
