import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, ThumbsUp, Eye } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import Testimonials from './Testimonials';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/assets/generated/hero-background.dim_1920x1080.png)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-cyan-950/60" />
        </div>

        {/* Content */}
        <div className="container relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 text-center">
          <div className="max-w-4xl space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <img
                src="/assets/generated/smm-ourprice-logo.dim_400x400.png"
                alt="IBAZEX"
                className="h-32 w-32 animate-in fade-in zoom-in duration-500"
              />
            </div>

            {/* Heading */}
            <h1 className="animate-in fade-in slide-in-from-bottom-4 text-5xl font-black tracking-tight duration-700 sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                IBAZEX
              </span>
            </h1>

            {/* Tagline */}
            <p className="animate-in fade-in slide-in-from-bottom-4 text-xl text-gray-300 duration-700 delay-150 sm:text-2xl md:text-3xl">
              خدمات التسويق عبر وسائل التواصل الاجتماعي الاحترافية
            </p>

            <p className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-2xl text-lg text-gray-400 duration-700 delay-300">
              عزز تواجدك على وسائل التواصل الاجتماعي بمتابعين وإعجابات ومشاهدات عالية الجودة عبر جميع المنصات الرئيسية.
              تسليم سريع، أسعار تنافسية، ونتائج مضمونة.
            </p>

            {/* WhatsApp Contact Info */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm">
                <SiWhatsapp className="h-4 w-4 text-green-500" />
                <span>اطلب خدماتك مباشرة عبر الواتساب</span>
              </div>
            </div>

            {/* Features */}
            <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-6 duration-700 delay-500 sm:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-sm">
                <Users className="h-10 w-10 text-cyan-500" />
                <h3 className="text-lg font-bold text-white">متابعون</h3>
                <p className="text-sm text-gray-400">نمِّ جمهورك</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-sm">
                <ThumbsUp className="h-10 w-10 text-cyan-500" />
                <h3 className="text-lg font-bold text-white">إعجابات</h3>
                <p className="text-sm text-gray-400">زد التفاعل</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-sm">
                <Eye className="h-10 w-10 text-cyan-500" />
                <h3 className="text-lg font-bold text-white">مشاهدات</h3>
                <p className="text-sm text-gray-400">عزز الظهور</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
              <Button
                size="lg"
                className="group h-14 bg-gradient-to-r from-cyan-500 to-cyan-600 px-8 text-lg font-bold text-white hover:from-cyan-600 hover:to-cyan-700"
                onClick={() => navigate({ to: '/services' })}
              >
                تصفح الخدمات
                <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />
    </>
  );
}
