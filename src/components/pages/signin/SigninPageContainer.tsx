'use client'

import { SigninForm } from '@/components/models/auth/SigninForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export function SigninPageContainer() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a session/auth check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust this duration as needed to match your session check time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[300px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <>
      <SigninForm />
      <Toaster />
    </>
  );
}
