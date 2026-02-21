import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, ThumbsUp, Eye, Clock } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX, SiYoutube, SiTiktok, SiWhatsapp } from 'react-icons/si';
import type { ServicePackage } from '../backend';
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
  service: ServicePackage;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [quantity, setQuantity] = useState(1);

  const PlatformIcon = platformIcons[service.platform];
  const ServiceIcon = serviceTypeIcons[service.serviceType];
  const serviceLabel = serviceTypeLabels[service.serviceType];

  const totalPrice = Number(service.priceDh) * quantity;

  const handleWhatsAppContact = () => {
    const whatsappUrl = generateWhatsAppUrl(service, quantity);
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
          {Number(service.quantity).toLocaleString()} {serviceLabel}
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
              {Number(service.priceDh)} درهم
            </div>
            <div className="text-xs text-muted-foreground">لكل باقة</div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`quantity-${service.id}`}>الكمية</Label>
          <Input
            id={`quantity-${service.id}`}
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="border-border/50"
          />
        </div>

        {quantity > 1 && (
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <div className="text-sm text-muted-foreground">المجموع</div>
            <div className="text-xl font-bold text-cyan-500">{totalPrice} درهم</div>
          </div>
        )}
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
