import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  children: React.ReactNode;
  asLabel?: boolean;
}

export default function Button({ 
  variant = "primary", 
  size = "md", 
  icon: Icon, 
  children, 
  className = "",
  asLabel = false,
  ...props 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg cursor-pointer font-medium transition-colors focus:outline-none";
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
    outline: "border-1 border-foreground bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2 text-base", 
    lg: "px-8 py-3 text-lg"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const content = (
    <>
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </>
  );
  
  if (asLabel) {
    return (
      <label 
        className={classes} 
        {...(props as React.LabelHTMLAttributes<HTMLLabelElement>)}
      >
        {content}
      </label>
    );
  }
  
  return (
    <button 
      className={classes} 
      {...props}
    >
      {content}
    </button>
  );
}
