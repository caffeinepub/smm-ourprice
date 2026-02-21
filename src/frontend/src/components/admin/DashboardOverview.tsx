import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllOrders } from '../../hooks/useQueries';
import { Package, Clock, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardOverview() {
  const { data: orders, isLoading } = useGetAllOrders();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter((order) => order.status === 'pending').length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.totalAmount), 0) || 0;

  // Convert cents to Dh (assuming totalAmount is stored in cents)
  const totalRevenueDh = Math.round(totalRevenue / 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">نظرة عامة على لوحة التحكم</h2>
        <p className="text-muted-foreground">راقب أداء عملك</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <Package className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-500">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">جميع الطلبات</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات المعلقة</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">في انتظار المعالجة</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{totalRevenueDh} درهم</div>
            <p className="text-xs text-muted-foreground">جميع الإيرادات</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
          <CardDescription>آخر الطلبات والتحديثات</CardDescription>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={Number(order.id)} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.cartItems.length} عنصر
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-cyan-500">{Math.round(Number(order.totalAmount) / 100)} درهم</p>
                    <p className="text-xs capitalize text-muted-foreground">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">لا توجد طلبات بعد</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
