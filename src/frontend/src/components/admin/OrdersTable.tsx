import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useGetAllOrders, useUpdateOrderStatus } from '../../hooks/useQueries';
import { OrderStatus } from '../../backend';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersTable() {
  const { data: orders, isLoading } = useGetAllOrders();
  const updateStatusMutation = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: bigint, status: OrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status });
      toast.success('تم تحديث حالة الطلب');
    } catch (error) {
      toast.error('فشل في تحديث حالة الطلب');
      console.error(error);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { label: 'قيد الانتظار', variant: 'default' as const, className: 'bg-amber-500 hover:bg-amber-600' },
      completed: { label: 'مكتمل', variant: 'default' as const, className: 'bg-emerald-500 hover:bg-emerald-600' },
      cancelled: { label: 'ملغي', variant: 'destructive' as const, className: '' },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const statusLabels = {
    pending: 'قيد الانتظار',
    completed: 'مكتمل',
    cancelled: 'ملغي',
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة الطلبات</CardTitle>
        <CardDescription>عرض وإدارة جميع طلبات العملاء</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>جهة الاتصال</TableHead>
                <TableHead>العناصر</TableHead>
                <TableHead>المجموع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={Number(order.id)}>
                    <TableCell className="font-medium">#{Number(order.id)}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {order.contactInfo.split('\n')[0]}
                    </TableCell>
                    <TableCell>{order.cartItems.length}</TableCell>
                    <TableCell className="font-semibold text-cyan-500">
                      {Math.round(Number(order.totalAmount) / 100)} درهم
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={OrderStatus.pending}>{statusLabels.pending}</SelectItem>
                          <SelectItem value={OrderStatus.completed}>{statusLabels.completed}</SelectItem>
                          <SelectItem value={OrderStatus.cancelled}>{statusLabels.cancelled}</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    لا توجد طلبات بعد
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
