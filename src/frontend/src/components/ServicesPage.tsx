import { useState } from 'react';
import { useGetAvailableServices } from '../hooks/useQueries';
import ServiceCard from './ServiceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Platform } from '../backend';

export default function ServicesPage() {
  const { data: services, isLoading } = useGetAvailableServices();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');

  const filteredServices = services?.filter(
    (service) => selectedPlatform === 'all' || service.platform === selectedPlatform
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-64" />
          <Skeleton className="mx-auto h-6 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">خدماتنا</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          اختر الخدمة المناسبة لك وحدد الكمية التي تريدها - نحن نوفر حلول مرنة لجميع احتياجاتك
        </p>
      </div>

      <Tabs value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as Platform | 'all')} className="mb-8">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value={Platform.facebook}>فيسبوك</TabsTrigger>
          <TabsTrigger value={Platform.instagram}>إنستغرام</TabsTrigger>
          <TabsTrigger value={Platform.youtube}>يوتيوب</TabsTrigger>
          <TabsTrigger value={Platform.tiktok}>تيك توك</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredServices && filteredServices.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={Number(service.id)} service={service} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">لا توجد خدمات متاحة حالياً</p>
        </div>
      )}
    </div>
  );
}
