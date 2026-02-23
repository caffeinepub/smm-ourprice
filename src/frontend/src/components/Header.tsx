import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Loader2, LogIn, LogOut, User } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      toast.success('تم تسجيل الخروج بنجاح');
    } else {
      try {
        await login();
        toast.success('تم تسجيل الدخول بنجاح');
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        } else {
          toast.error('فشل تسجيل الدخول');
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 space-x-reverse">
          <img
            src="/assets/generated/smm-ourprice-logo.dim_400x400.png"
            alt="IBAZEX"
            className="h-10 w-10"
          />
          <span className="text-xl font-bold">
            <span className="text-cyan-500">IBAZEX</span>
          </span>
        </Link>

        <nav className="flex items-center space-x-4 space-x-reverse">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-cyan-500"
            activeProps={{ className: 'text-cyan-500' }}
          >
            الرئيسية
          </Link>
          <Link
            to="/services"
            className="text-sm font-medium transition-colors hover:text-cyan-500"
            activeProps={{ className: 'text-cyan-500' }}
          >
            الخدمات
          </Link>
          <Link
            to="/admin"
            className="text-sm font-medium transition-colors hover:text-cyan-500"
            activeProps={{ className: 'text-cyan-500' }}
          >
            لوحة التحكم
          </Link>

          <div className="flex items-center gap-2 mr-2">
            {isAuthenticated && userProfile && !profileLoading && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <User className="h-4 w-4 text-cyan-500" />
                <span className="text-sm font-medium text-cyan-500">{userProfile.name}</span>
              </div>
            )}
            
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className={
                isAuthenticated
                  ? 'border-cyan-500/50 hover:bg-cyan-500/10'
                  : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
              }
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جارٍ الدخول...
                </>
              ) : isAuthenticated ? (
                <>
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </>
              ) : (
                <>
                  <LogIn className="ml-2 h-4 w-4" />
                  تسجيل الدخول
                </>
              )}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
