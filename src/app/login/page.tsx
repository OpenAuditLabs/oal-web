import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

export const metadata = {
  title: 'Login | OpenAuditLabs',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
