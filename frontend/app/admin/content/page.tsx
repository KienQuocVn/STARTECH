import { DashboardLayout } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminContentPage() {
  return (
    <DashboardLayout>
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <Badge className="w-fit bg-amber-100 text-amber-700 hover:bg-amber-100">Admin Route Group</Badge>
          <CardTitle>Quan ly Site Content</CardTitle>
          <CardDescription>
            Route nay duoc mo de phuc vu CRUD cho `SitePage`, `PageSection` va `FaqItem`.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
          <p>Content model dong da co o database va API. Dashboard nay la diem vao de tiep tuc gan giao dien CMS.</p>
          <p>Homepage va landing page thiet ke website hien la 2 trang uu tien de quan tri qua admin.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
