import { DashboardLayout } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLeadsPage() {
  return (
    <DashboardLayout>
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <Badge className="w-fit bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Admin Route Group</Badge>
          <CardTitle>Quan ly lead lien he</CardTitle>
          <CardDescription>
            Route nay duoc dung cho contact submission, cap nhat trang thai lead va theo doi xu ly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
          <p>Backend contact da co luu DB, gui mail va hook Google Sheet. Admin se tiep tuc su dung route nay de xu ly lead.</p>
          <p>Trang thai lead hien tai co cac moc `WAITING`, `VIEWED`, `PROCESSED`.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
