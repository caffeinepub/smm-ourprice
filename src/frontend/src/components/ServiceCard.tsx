import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, ThumbsUp, Eye, Clock } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX, SiYoutube, SiTiktok, SiWhatsapp } from 'react-icons/si';
import type { Service } from '../backend';
import { generateWhatsAppUrl } from '../utils/whatsapp';
import { toast } from 'sonner';

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

const platformLabels = {
  facebook: 'فيسبوك',
  instagram: 'إنستغرام',
  youtube: 'يوتيوب',
  tiktok: 'تيك توك',
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const MIN_QUANTITY = 100;
  const MAX_QUANTITY = 1000000;
  const [quantity, setQuantity] = useState(1000);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  
  // Order form state
  const [orderForm, setOrderForm] = useState({
    username: '',
    accountLink: '',
    postLink: '',
    quantity: 1000,
  });

  const PlatformIcon = platformIcons[service.platform];
  const ServiceIcon = serviceTypeIcons[service.serviceType];
  const serviceLabel = serviceTypeLabels[service.serviceType];
  const platformLabel = platformLabels[service.platform];

  const unitPrice = Number(service.baseUnitPriceDh);
  const totalPrice = (unitPrice * quantity) / 1000;

  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value) || MIN_QUANTITY;
    const clampedValue = Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY, numValue));
    setQuantity(clampedValue);
  };

  const handleOpenOrderDialog = () => {
    setOrderForm({
      username: '',
      accountLink: '',
      postLink: '',
      quantity: quantity,
    });
    setIsOrderDialogOpen(true);
  };

  const handleOrderFormChange = (field: string, value: string | number) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = () => {
    // Validate form
    if (!orderForm.username.trim()) {
      toast.error('يرجى إدخال اسم المستخدم');
      return;
    }
    if (!orderForm.accountLink.trim()) {
      toast.error('يرجى إدخال رابط الحساب');
      return;
    }
    if (!orderForm.postLink.trim()) {
      toast.error('يرجى إدخال رابط المنشور');
      return;
    }
    if (orderForm.quantity < MIN_QUANTITY || orderForm.quantity > MAX_QUANTITY) {
      toast.error(`الكمية يجب أن تكون بين ${MIN_QUANTITY.toLocaleString()} و ${MAX_QUANTITY.toLocaleString()}`);
      return;
    }

    const orderTotalPrice = (unitPrice * orderForm.quantity) / 1000;
    const whatsappUrl = generateWhatsAppUrl(
      service,
      orderForm.quantity,
      orderTotalPrice,
      orderForm.username,
      orderForm.accountLink,
      orderForm.postLink
    );
    
    window.open(whatsappUrl, '_blank');
    setIsOrderDialogOpen(false);
    toast.success('تم فتح الواتساب لإكمال الطلب');
  };

  return (
    <>
      <Card className="group overflow-hidden border-border/50 transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
        <CardHeader className="space-y-3 bg-gradient-to-br from-muted/50 to-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-cyan-500/10 p-2">
                <PlatformIcon className="h-5 w-5 text-cyan-500" />
              </div>
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-500">
                {platformLabel}
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
          {/* Price Display - Prominent */}
          <div className="rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 p-4 text-center border-2 border-cyan-500/30">
            <div className="text-sm text-muted-foreground mb-1">السعر</div>
            <div className="text-3xl font-bold text-cyan-500">
              {unitPrice} درهم
            </div>
            <div className="text-xs text-muted-foreground mt-1">لكل 1000 {serviceLabel}</div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{service.deliveryEstimate}</span>
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
            onClick={handleOpenOrderDialog}
          >
            <SiWhatsapp className="ml-2 h-5 w-5" />
            اطلب الآن
          </Button>
        </CardFooter>
      </Card>

      {/* Order Form Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
            <DialogDescription>
              يرجى ملء جميع الحقول لإكمال طلبك
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم *</Label>
              <Input
                id="username"
                placeholder="أدخل اسم المستخدم"
                value={orderForm.username}
                onChange={(e) => handleOrderFormChange('username', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountLink">رابط الحساب *</Label>
              <Input
                id="accountLink"
                type="url"
                placeholder="https://..."
                value={orderForm.accountLink}
                onChange={(e) => handleOrderFormChange('accountLink', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postLink">رابط المنشور *</Label>
              <Input
                id="postLink"
                type="url"
                placeholder="https://..."
                value={orderForm.postLink}
                onChange={(e) => handleOrderFormChange('postLink', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderQuantity">الكمية *</Label>
              <Input
                id="orderQuantity"
                type="number"
                min={MIN_QUANTITY}
                max={MAX_QUANTITY}
                step="100"
                value={orderForm.quantity}
                onChange={(e) => handleOrderFormChange('quantity', parseInt(e.target.value) || MIN_QUANTITY)}
                required
              />
              <p className="text-xs text-muted-foreground">
                من {MIN_QUANTITY.toLocaleString()} إلى {MAX_QUANTITY.toLocaleString()}
              </p>
            </div>

            {/* Order Summary */}
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="text-sm font-semibold">ملخص الطلب:</div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المنصة:</span>
                  <span>{platformLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الخدمة:</span>
                  <span>{serviceLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الكمية:</span>
                  <span>{orderForm.quantity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-cyan-500 pt-2 border-t">
                  <span>المجموع:</span>
                  <span>{((unitPrice * orderForm.quantity) / 1000).toFixed(2)} درهم</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOrderDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSubmitOrder}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <SiWhatsapp className="ml-2 h-4 w-4" />
              إرسال عبر الواتساب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
