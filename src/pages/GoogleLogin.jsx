import React from 'react';
import { LogIn } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import GoogleIcon from '@/components/GoogleIcon';
import { Button } from '@/components/ui/button';
import { site } from '@/api/siteClient';
import { useAuth } from '@/lib/AuthContext';
import { safeReturnTo } from '@/lib/authReturnTo';

export default function GoogleLogin() {
  const { appPublicSettings, user, logout } = useAuth();
  return <AuthLayout icon={LogIn} title="Ponte Social" subtitle="Acesso à conta">
    {user ? <Button onClick={() => logout()}>Sair</Button> :
      <Button variant="outline" className="w-full h-12 text-sm font-medium"
        disabled={!appPublicSettings.google_enabled}
        onClick={() => site.auth.loginWithProvider('google', safeReturnTo())}>
        <GoogleIcon className="w-5 h-5 mr-2" />Continuar com Google
      </Button>}
    {!appPublicSettings.google_enabled && <p className="mt-4 text-sm text-muted-foreground">Acesso ainda não disponível.</p>}
  </AuthLayout>;
}
