import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useGetAvailableServices, useAddService, useUpdateService, useUpdateServicePrice } from '../../hooks/useQueries';
import { Platform, ServiceType } from '../../backend';
import { Plus, Loader2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ServiceManagement() {
  const { data: services, isLoading } = useGetAvailableServices();
  const addServiceMutation = useAddService();
  const updateServiceMutation = useUpdateService();
  const updatePriceMutation = useUpdateServicePrice();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editPriceDialog, setEditPriceDialog] = useState<{ open: boolean; serviceId: bigint | null; currentPrice: number }>({
    open: false,
    serviceId: null,
    currentPrice: 0,
  });
  const [newPrice, setNewPrice] = useState('');

  const [formData, setFormData] = useState({
    platform: Platform.facebook,
    serviceType: ServiceType.followers,
    baseUnitPriceDh: '',
    deliveryEstimate: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const priceDhValue = BigInt(formData.baseUnitPriceDh);
      const priceInCents = priceDhValue * BigInt(100);

      await addServiceMutation.mutateAsync({
        platform: formData.platform,
        serviceType: formData.serviceType,
        baseUnitPriceCents: priceInCents,
        baseUnitPriceDh: priceDhValue,
        deliveryEstimate: formData.deliveryEstimate,
        description: formData.description,
      });

      toast.success('تمت إضافة الخدمة بنجاح');
      setIsDialogOpen(false);
      setFormData({
        platform: Platform.facebook,
        serviceType: ServiceType.followers,
        baseUnitPriceDh: '',
        deliveryEstimate: '',
        description: '',
      });
    } catch (error) {
      toast.error('فشل في إضافة الخدمة');
      console.error(error);
    }
  };

  const handleToggleAvailability = async (id: bigint, baseUnitPriceCents: bigint, baseUnitPriceDh: bigint, currentAvailable: boolean) => {
    try {
      await updateServiceMutation.mutateAsync({
        id,
        baseUnitPriceCents,
        baseUnitPriceDh,
        available: !currentAvailable,
      });
      toast.success(`تم ${!currentAvailable ? 'تفعيل' : 'تعطيل'} الخدمة`);
    } catch (error) {
      toast.error('فشل في تحديث الخدمة');
      console.error(error);
    }
  };

  const handleOpenEditPrice = (serviceId: bigint, currentPrice: number) => {
    setEditPriceDialog({ open: true, serviceId, currentPrice });
    setNewPrice(currentPrice.toString());
  };

  const handleUpdatePrice = async () => {
    if (!editPriceDialog.serviceId) return;

    const priceValue = parseInt(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error('يرجى إدخال سعر صحيح');
      return;
    }

    try {
      await updatePriceMutation.mutateAsync({
        id: editPriceDialog.serviceId,
        newPriceDh: BigInt(priceValue),
      });
      toast.success('تم تحديث السعر بنجاح');
      setEditPriceDialog({ open: false, serviceId: null, currentPrice: 0 });
      setNewPrice('');
    } catch (error) {
      toast.error('فشل في تحديث السعر');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>الخدمات المتاحة</CardTitle>
            <CardDescription>إدارة خدمات وسائل التواصل الاجتماعي</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700">
                <Plus className="ml-2 h-4 w-4" />
                إضافة خدمة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة خدمة جديدة</DialogTitle>
                <DialogDescription>إنشاء خدمة جديدة مع تسعير مرن حسب الكمية</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">المنصة</Label>
                    <Select
                      value={formData.platform}
                      onValueChange={(value) => setFormData({ ...formData, platform: value as Platform })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Platform.facebook}>فيسبوك</SelectItem>
                        <SelectItem value={Platform.instagram}>إنستغرام</SelectItem>
                        <SelectItem value={Platform.youtube}>يوتيوب</SelectItem>
                        <SelectItem value={Platform.tiktok}>تيك توك</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceType">نوع الخدمة</Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(value) => setFormData({ ...formData, serviceType: value as ServiceType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ServiceType.followers}>متابعون</SelectItem>
                        <SelectItem value={ServiceType.likes}>إعجابات</SelectItem>
                        <SelectItem value={ServiceType.views}>مشاهدات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseUnitPriceDh">سعر الوحدة (درهم لكل 1000)</Label>
                  <Input
                    id="baseUnitPriceDh"
                    type="number"
                    placeholder="25"
                    value={formData.baseUnitPriceDh}
                    onChange={(e) => setFormData({ ...formData, baseUnitPriceDh: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    السعر لكل 1000 وحدة (متابع/إعجاب/مشاهدة)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryEstimate">وقت التسليم المتوقع</Label>
                  <Input
                    id="deliveryEstimate"
                    placeholder="1-3 أيام"
                    value={formData.deliveryEstimate}
                    onChange={(e) => setFormData({ ...formData, deliveryEstimate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    placeholder="خدمة عالية الجودة من حسابات حقيقية ونشطة..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
                    disabled={addServiceMutation.isPending}
                  >
                    {addServiceMutation.isPending ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جارٍ الإضافة...
                      </>
                    ) : (
                      'إضافة الخدمة'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المنصة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>سعر الوحدة</TableHead>
                <TableHead>التسليم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>متاح</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services && services.length > 0 ? (
                services.map((service) => (
                  <TableRow key={Number(service.id)}>
                    <TableCell className="font-medium capitalize">{service.platform}</TableCell>
                    <TableCell className="capitalize">{service.serviceType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-semibold">{Number(service.baseUnitPriceDh)} درهم</div>
                          <div className="text-xs text-muted-foreground">لكل 1000</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenEditPrice(service.id, Number(service.baseUnitPriceDh))}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{service.deliveryEstimate}</TableCell>
                    <TableCell>
                      <Badge variant={service.available ? 'default' : 'secondary'} className={service.available ? 'bg-cyan-500 hover:bg-cyan-600' : ''}>
                        {service.available ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={service.available}
                        onCheckedChange={() => handleToggleAvailability(service.id, service.baseUnitPriceCents, service.baseUnitPriceDh, service.available)}
                        disabled={updateServiceMutation.isPending}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    لا توجد خدمات متاحة. أضف الخدمة الأولى.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit Price Dialog */}
      <Dialog open={editPriceDialog.open} onOpenChange={(open) => setEditPriceDialog({ ...editPriceDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل السعر</DialogTitle>
            <DialogDescription>
              تحديث سعر الوحدة لكل 1000 (متابع/إعجاب/مشاهدة)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPrice">السعر الجديد (درهم)</Label>
              <Input
                id="newPrice"
                type="number"
                min="1"
                placeholder="أدخل السعر الجديد"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                السعر الحالي: {editPriceDialog.currentPrice} درهم
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditPriceDialog({ open: false, serviceId: null, currentPrice: 0 })}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleUpdatePrice}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
              disabled={updatePriceMutation.isPending}
            >
              {updatePriceMutation.isPending ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جارٍ التحديث...
                </>
              ) : (
                'تحديث السعر'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
