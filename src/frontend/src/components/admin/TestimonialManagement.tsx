import { useState } from 'react';
import { useGetAllTestimonials, useAddTestimonial } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Star, Users, ThumbsUp, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { ServiceType } from '../../backend';

const serviceTypeLabels: Record<ServiceType, string> = {
  [ServiceType.followers]: 'متابعون',
  [ServiceType.likes]: 'إعجابات',
  [ServiceType.views]: 'مشاهدات',
};

const serviceTypeIcons: Record<ServiceType, React.ReactNode> = {
  [ServiceType.followers]: <Users className="h-4 w-4" />,
  [ServiceType.likes]: <ThumbsUp className="h-4 w-4" />,
  [ServiceType.views]: <Eye className="h-4 w-4" />,
};

export default function TestimonialManagement() {
  const { data: testimonials, isLoading } = useGetAllTestimonials();
  const addTestimonial = useAddTestimonial();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    serviceType: ServiceType.followers,
    testimonialText: '',
    rating: '5',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName.trim() || !formData.testimonialText.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const rating = parseInt(formData.rating);
    if (rating < 1 || rating > 5) {
      toast.error('التقييم يجب أن يكون بين 1 و 5');
      return;
    }

    try {
      await addTestimonial.mutateAsync({
        customerName: formData.customerName,
        serviceType: formData.serviceType,
        testimonialText: formData.testimonialText,
        rating: BigInt(rating),
      });

      toast.success('تم إضافة الرأي بنجاح');
      setIsDialogOpen(false);
      setFormData({
        customerName: '',
        serviceType: ServiceType.followers,
        testimonialText: '',
        rating: '5',
      });
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('فشل في إضافة الرأي');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">إدارة الآراء</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="ml-2 h-4 w-4" />
              إضافة رأي جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>إضافة رأي عميل جديد</DialogTitle>
                <DialogDescription>
                  أضف رأي عميل جديد لعرضه على الصفحة الرئيسية
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="customerName">اسم العميل</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="أدخل اسم العميل"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="serviceType">الخدمة</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, serviceType: value as ServiceType })
                    }
                  >
                    <SelectTrigger id="serviceType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ServiceType.followers}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          متابعون
                        </div>
                      </SelectItem>
                      <SelectItem value={ServiceType.likes}>
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4" />
                          إعجابات
                        </div>
                      </SelectItem>
                      <SelectItem value={ServiceType.views}>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          مشاهدات
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rating">التقييم (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="testimonialText">النص</Label>
                  <Textarea
                    id="testimonialText"
                    value={formData.testimonialText}
                    onChange={(e) =>
                      setFormData({ ...formData, testimonialText: e.target.value })
                    }
                    placeholder="أدخل رأي العميل"
                    rows={4}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700"
                  disabled={addTestimonial.isPending}
                >
                  {addTestimonial.isPending ? 'جاري الإضافة...' : 'إضافة'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-muted-foreground">جاري التحميل...</div>
        ) : !testimonials || testimonials.length === 0 ? (
          <div className="text-center text-muted-foreground">
            لا توجد آراء حالياً. أضف رأي جديد للبدء.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم العميل</TableHead>
                <TableHead>الخدمة</TableHead>
                <TableHead>التقييم</TableHead>
                <TableHead>النص</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {testimonial.customerName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {serviceTypeIcons[testimonial.serviceType]}
                      <span>{serviceTypeLabels[testimonial.serviceType]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Number(testimonial.rating)
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {testimonial.testimonialText}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
