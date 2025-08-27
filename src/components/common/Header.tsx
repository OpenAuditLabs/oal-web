import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function Header({
  title,
  subtitle,
  children
}: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        
        {children && (
          <div className="flex items-center gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
