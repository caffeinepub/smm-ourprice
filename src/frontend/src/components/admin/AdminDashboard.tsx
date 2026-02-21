import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardOverview from './DashboardOverview';
import ServiceManagement from './ServiceManagement';
import OrdersTable from './OrdersTable';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-black tracking-tight">
          <span className="text-cyan-500">لوحة التحكم</span> الإدارية
        </h1>
        <p className="text-muted-foreground">إدارة الخدمات والطلبات وعرض التحليلات</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">نظرة عامة</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">الخدمات</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">الطلبات</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardOverview />
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <ServiceManagement />
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
