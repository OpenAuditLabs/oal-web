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
  const baseClasses = "inline-flex items-center gap-2 rounded-lg cursor-pointer font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "text-white hover:opacity-90",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    outline: "border-2 bg-transparent hover:text-white"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2 text-base", 
    lg: "px-8 py-3 text-lg"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return { backgroundColor: "#008937", borderColor: "#008937" };
      case "outline":
        return { borderColor: "#008937", color: "#008937" };
      default:
        return {};
    }
  };
  
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
        style={getButtonStyle()}
        {...(props as any)}
      >
        {content}
      </label>
    );
  }
  
  return (
    <button 
      className={classes} 
      style={getButtonStyle()}
      {...props}
    >
      {content}
    </button>
  );
}
