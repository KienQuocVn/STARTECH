import { DashboardLayout } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminProjectsPage() {
  return (
    <DashboardLayout>
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <Badge className="w-fit bg-sky-100 text-sky-700 hover:bg-sky-100">Admin Route Group</Badge>
          <CardTitle>Quan ly du an va showcase</CardTitle>
          <CardDescription>
            Route nay da san sang de gan CRUD cho product, category, showcase va cac bo loc portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
          <p>Backend da duoc bo sung write endpoints de mo ra chuc nang admin cho product/category/showcase.</p>
          <p>Buoc UI tiep theo la danh sach, form sua va quy trinh publish trong dashboard.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
