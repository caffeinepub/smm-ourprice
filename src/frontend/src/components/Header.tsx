import { Link } from '@tanstack/react-router';

export default function Header() {
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

        <nav className="flex items-center space-x-6 space-x-reverse">
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
        </nav>
      </div>
    </header>
  );
}
