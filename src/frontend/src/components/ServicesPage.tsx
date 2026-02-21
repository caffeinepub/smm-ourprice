import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAvailableServices } from '../hooks/useQueries';
import ServiceCard from './ServiceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Platform } from '../backend';
import { SiFacebook, SiInstagram, SiX, SiYoutube, SiTiktok } from 'react-icons/si';

const platformIcons = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  twitter: SiX,
  youtube: SiYoutube,
  tiktok: SiTiktok,
};

const platformLabels = {
  facebook: 'فيسبوك',
  instagram: 'إنستغرام',
  twitter: 'تويتر',
  youtube: 'يوتيوب',
  tiktok: 'تيك توك',
};

export default function ServicesPage() {
  const { data: services, isLoading } = useGetAvailableServices();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(Platform.facebook);

  const filteredServices = services?.filter((service) => service.platform === selectedPlatform) || [];

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">
          <span className="text-cyan-500">خدماتنا</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          اختر من بين مجموعة واسعة من باقات التسويق عبر وسائل التواصل الاجتماعي. حدد منصتك ونوع الخدمة للبدء.
        </p>
      </div>

      <Tabs value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as Platform)} className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-5 bg-muted/50">
          {Object.entries(platformLabels).map(([key, label]) => {
            const Icon = platformIcons[key as keyof typeof platformIcons];
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.keys(platformLabels).map((platform) => (
          <TabsContent key={platform} value={platform} className="mt-0">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full" />
                ))}
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => (
                  <ServiceCard key={Number(service.id)} service={service} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <p className="text-lg font-medium text-muted-foreground">لا توجد خدمات متاحة</p>
                  <p className="text-sm text-muted-foreground">تحقق لاحقاً للحصول على باقات جديدة</p>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
