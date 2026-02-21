import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, ThumbsUp, Eye, Clock } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX, SiYoutube, SiTiktok, SiWhatsapp } from 'react-icons/si';
import type { Service } from '../backend';
import { generateWhatsAppUrl } from '../utils/whatsapp';

const platformIcons = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  twitter: SiX,
  youtube: SiYoutube,
  tiktok: SiTiktok,
};

const serviceTypeIcons = {
  followers: Users,
  likes: ThumbsUp,
  views: Eye,
};

const serviceTypeLabels = {
  followers: 'متابعون',
  likes: 'إعجابات',
  views: 'مشاهدات',
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const MIN_QUANTITY = 100;
  const MAX_QUANTITY = 1000000;
  const [quantity, setQuantity] = useState(1000);

  const PlatformIcon = platformIcons[service.platform];
  const ServiceIcon = serviceTypeIcons[service.serviceType];
  const serviceLabel = serviceTypeLabels[service.serviceType];

  const unitPrice = Number(service.baseUnitPriceDh);
  const totalPrice = (unitPrice * quantity) / 1000; // Price is per 1000 units

  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value) || MIN_QUANTITY;
    const clampedValue = Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY, numValue));
    setQuantity(clampedValue);
  };

  const handleWhatsAppContact = () => {
    const whatsappUrl = generateWhatsAppUrl(service, quantity, totalPrice);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="group overflow-hidden border-border/50 transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
      <CardHeader className="space-y-3 bg-gradient-to-br from-muted/50 to-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-cyan-500/10 p-2">
              <PlatformIcon className="h-5 w-5 text-cyan-500" />
            </div>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-500">
              {service.platform}
            </Badge>
          </div>
          <div className="rounded-full bg-cyan-500/10 p-2">
            <ServiceIcon className="h-5 w-5 text-cyan-500" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          {serviceLabel}
        </CardTitle>
        <CardDescription className="line-clamp-2">{service.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{service.deliveryEstimate}</span>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-cyan-500">
              {unitPrice} درهم
            </div>
            <div className="text-xs text-muted-foreground">لكل 1000 {serviceLabel}</div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`quantity-${service.id}`}>الكمية المرغوبة</Label>
          <Input
            id={`quantity-${service.id}`}
            type="number"
            min={MIN_QUANTITY}
            max={MAX_QUANTITY}
            step="100"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="border-border/50"
            placeholder={`أدخل الكمية (${MIN_QUANTITY.toLocaleString()} - ${MAX_QUANTITY.toLocaleString()})`}
          />
          <p className="text-xs text-muted-foreground">
            الحد الأدنى: {MIN_QUANTITY.toLocaleString()} | الحد الأقصى: {MAX_QUANTITY.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 p-4 text-center border border-cyan-500/20">
          <div className="text-sm text-muted-foreground mb-1">المجموع الكلي</div>
          <div className="text-3xl font-bold text-cyan-500">{totalPrice.toFixed(2)} درهم</div>
          <div className="text-xs text-muted-foreground mt-1">
            {quantity.toLocaleString()} {serviceLabel}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full bg-gradient-to-r from-green-500 to-green-600 font-semibold hover:from-green-600 hover:to-green-700"
          onClick={handleWhatsAppContact}
        >
          <SiWhatsapp className="ml-2 h-5 w-5" />
          تواصل عبر الواتساب
        </Button>
      </CardFooter>
    </Card>
  );
}
