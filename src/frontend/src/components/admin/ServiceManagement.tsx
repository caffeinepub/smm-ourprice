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
import { useGetAvailableServices, useAddServicePackage, useUpdateServicePackage } from '../../hooks/useQueries';
import { Platform, ServiceType } from '../../backend';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ServiceManagement() {
  const { data: services, isLoading } = useGetAvailableServices();
  const addServiceMutation = useAddServicePackage();
  const updateServiceMutation = useUpdateServicePackage();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    platform: Platform.facebook,
    serviceType: ServiceType.followers,
    quantity: '',
    priceDh: '',
    deliveryEstimate: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const priceDhValue = BigInt(formData.priceDh);
      const priceInCents = priceDhValue * BigInt(100); // Convert to cents for backend compatibility

      await addServiceMutation.mutateAsync({
        platform: formData.platform,
        serviceType: formData.serviceType,
        quantity: BigInt(formData.quantity),
        price: priceInCents,
        priceDh: priceDhValue,
        deliveryEstimate: formData.deliveryEstimate,
        description: formData.description,
      });

      toast.success('تمت إضافة باقة الخدمة بنجاح');
      setIsDialogOpen(false);
      setFormData({
        platform: Platform.facebook,
        serviceType: ServiceType.followers,
        quantity: '',
        priceDh: '',
        deliveryEstimate: '',
        description: '',
      });
    } catch (error) {
      toast.error('فشل في إضافة باقة الخدمة');
      console.error(error);
    }
  };

  const handleToggleAvailability = async (id: bigint, price: bigint, priceDh: bigint, currentAvailable: boolean) => {
    try {
      await updateServiceMutation.mutateAsync({
        id,
        price,
        priceDh,
        available: !currentAvailable,
      });
      toast.success(`تم ${!currentAvailable ? 'تفعيل' : 'تعطيل'} الخدمة`);
    } catch (error) {
      toast.error('فشل في تحديث الخدمة');
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
            <CardTitle>باقات الخدمات</CardTitle>
            <CardDescription>إدارة عروض الخدمات الخاصة بك</CardDescription>
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
                <DialogTitle>إضافة باقة خدمة جديدة</DialogTitle>
                <DialogDescription>إنشاء باقة خدمة جديدة للعملاء لشرائها</DialogDescription>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">الكمية</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="1000"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceDh">السعر (درهم)</Label>
                    <Input
                      id="priceDh"
                      type="number"
                      placeholder="25"
                      value={formData.priceDh}
                      onChange={(e) => setFormData({ ...formData, priceDh: e.target.value })}
                      required
                    />
                  </div>
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
                    placeholder="متابعون عالي الجودة من حسابات حقيقية..."
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
                <TableHead>الكمية</TableHead>
                <TableHead>السعر</TableHead>
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
                    <TableCell>{Number(service.quantity).toLocaleString()}</TableCell>
                    <TableCell>{Number(service.priceDh)} درهم</TableCell>
                    <TableCell>{service.deliveryEstimate}</TableCell>
                    <TableCell>
                      <Badge variant={service.available ? 'default' : 'secondary'} className={service.available ? 'bg-cyan-500 hover:bg-cyan-600' : ''}>
                        {service.available ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={service.available}
                        onCheckedChange={() => handleToggleAvailability(service.id, service.price, service.priceDh, service.available)}
                        disabled={updateServiceMutation.isPending}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    لا توجد خدمات متاحة. أضف باقة الخدمة الأولى.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
