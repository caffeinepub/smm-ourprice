import { SiFacebook, SiInstagram, SiWhatsapp } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'smm-ourprice'
  );

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <img
                src="/assets/generated/smm-ourprice-logo.dim_400x400.png"
                alt="SMM Ourprice"
                className="h-10 w-10"
              />
              <span className="text-lg font-bold">
                <span className="text-foreground">SMM</span>{' '}
                <span className="text-cyan-500">OURPRICE</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              خدمات التسويق عبر وسائل التواصل الاجتماعي الاحترافية. عزز تواجدك بمتابعين وإعجابات ومشاهدات عالية الجودة.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">روابط سريعة</h3>
            <nav className="flex flex-col space-y-2">
              <a href="/" className="text-sm text-muted-foreground hover:text-cyan-500 transition-colors">
                الرئيسية
              </a>
              <a href="/services" className="text-sm text-muted-foreground hover:text-cyan-500 transition-colors">
                الخدمات
              </a>
              <a href="/admin" className="text-sm text-muted-foreground hover:text-cyan-500 transition-colors">
                لوحة التحكم
              </a>
            </nav>
          </div>

          {/* Contact & Social */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">تواصل معنا</h3>
            <div className="flex space-x-4 space-x-reverse">
              <a
                href="https://www.facebook.com/share/14SkZkmPmwb/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-cyan-500 transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/smm__ourprice?igsh=MWJ0MWZwZ2VoZzRhYg=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-cyan-500 transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://wa.me/212779781318"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-cyan-500 transition-colors"
                aria-label="WhatsApp"
              >
                <SiWhatsapp className="h-6 w-6" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              واتساب: <a href="https://wa.me/212779781318" className="hover:text-cyan-500 transition-colors">+212 779-781318</a>
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} SMM Ourprice. جميع الحقوق محفوظة.
          </p>
          <p className="mt-2 text-sm text-muted-foreground flex items-center justify-center gap-1">
            صُنع بـ <Heart className="h-4 w-4 text-cyan-500 fill-cyan-500" /> باستخدام{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
