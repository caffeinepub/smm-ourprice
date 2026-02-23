import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Loader2, ShieldAlert, LogIn } from 'lucide-react';

interface AdminAuthGateProps {
  children: React.ReactNode;
}

export default function AdminAuthGate({ children }: AdminAuthGateProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Show loading while checking authentication and admin status
  if (isLoggingIn || profileLoading || adminLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border/50">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto rounded-full bg-cyan-500/10 p-4 w-fit">
              <Lock className="h-8 w-8 text-cyan-500" />
            </div>
            <CardTitle className="text-2xl">لوحة التحكم الإدارية</CardTitle>
            <CardDescription>
              يرجى تسجيل الدخول للوصول إلى لوحة التحكم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={login}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
            >
              <LogIn className="ml-2 h-4 w-4" />
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if authenticated but not admin
  if (isAuthenticated && profileFetched && !isAdmin) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-destructive/50">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto rounded-full bg-destructive/10 p-4 w-fit">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">الوصول مرفوض</CardTitle>
            <CardDescription>
              ليس لديك صلاحيات للوصول إلى لوحة التحكم الإدارية
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            <p>هذه الصفحة مخصصة للمسؤولين فقط.</p>
            <p className="mt-2">إذا كنت تعتقد أن هذا خطأ، يرجى الاتصال بالدعم.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and is admin
  return <>{children}</>;
}
