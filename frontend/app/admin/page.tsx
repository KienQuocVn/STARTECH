'use client';

import { BarChart3, BriefcaseBusiness, Clock3, FilePenLine, FolderKanban, Sparkles, Users2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const kpis = [
  {
    label: 'Du an portfolio',
    value: '50+',
    detail: 'Da co slug va route chi tiet theo slug',
    icon: FolderKanban,
    tone: 'bg-amber-100 text-amber-700',
  },
  {
    label: 'Trang noi dung dong',
    value: '2',
    detail: 'Trang chu va landing page thiet ke website',
    icon: FilePenLine,
    tone: 'bg-sky-100 text-sky-700',
  },
  {
    label: 'Lead can xu ly',
    value: '12',
    detail: 'Lay tu contact submission va dong bo mail/sheet',
    icon: BriefcaseBusiness,
    tone: 'bg-emerald-100 text-emerald-700',
  },
  {
    label: 'Vai tro admin',
    value: '3',
    detail: 'SUPER_ADMIN, EDITOR, VIEWER',
    icon: Users2,
    tone: 'bg-violet-100 text-violet-700',
  },
];

const launchTracks = [
  { name: 'Auth va login admin', progress: 70, note: 'Da co Prisma User, JWT login, form login noi backend.' },
  { name: 'CMS cho site content', progress: 45, note: 'Da co SitePage/PageSection/FaqItem, chua co CRUD admin day du.' },
  { name: 'Van hanh lead va project', progress: 55, note: 'Da co contact submission va du an theo slug, can dashboard/CRUD.' },
  { name: 'Production hardening', progress: 35, note: 'Da co logger, throttler, health check; chua co CI/CD va monitoring.' },
];

const focusItems = [
  {
    title: 'Noi dung can dua vao CRUD',
    description: 'Homepage hero, stats, services va FAQ da co data model. Buoc tiep theo la giao dien admin de sua truc tiep.',
    badge: 'Content Ops',
  },
  {
    title: 'Backend can giam return object thu cong',
    description: 'Nhieu service van tra object success/statusCode/message/data, can tiep tuc refactor sang exception + mapper nhat quan.',
    badge: 'Code Quality',
  },
  {
    title: 'Media/upload van la khoang trong',
    description: 'De hoan thien CMS, du an can module upload hinh/asset thay vi backfill bang public folder va seed.',
    badge: 'Phase 5',
  },
];

const recentActions = [
  { time: 'Hom nay', title: 'Database da duoc update lai voi bang noi dung dong va slug product', status: 'done' },
  { time: 'Hom nay', title: 'Dang nhap admin da co JWT + role foundation', status: 'new' },
  { time: 'Ke tiep', title: 'Can mo CRUD cho SitePage, PageSection, FAQ va contact submission', status: 'next' },
];

export default function AdminPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-4">
            <Badge className="w-fit bg-amber-100 px-3 py-1 text-amber-700 hover:bg-amber-100">STARTECH Admin Roadmap</Badge>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-slate-950">
                Dashboard nay da duoc doi huong sang van hanh portfolio, noi dung va lead thay vi template workflow chung chung.
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600">
                Muc tieu cua Phase 5 la bien STARTECH tu mot website marketing co du lieu seed thanh mot he thong co the
                dang nhap, quan ly noi dung, theo doi lead va san sang cho quy trinh CMS nho gon.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-slate-950 text-white hover:bg-slate-800">Mo rong CRUD admin</Button>
              <Button variant="outline" className="border-slate-200 bg-transparent">
                Kiem tra trang thai phase
              </Button>
            </div>
          </div>

          <Card className="border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_60%,#334155_100%)] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-amber-300" />
                Snapshot hien tai
              </CardTitle>
              <CardDescription className="text-slate-300">
                Phase 3 va 4 da co mot phan nen; Phase 5 dang duoc khoi dong tu auth + admin alignment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-200">
              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                <span>API base</span>
                <span className="font-medium text-white">/api/v1</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                <span>Auth mode</span>
                <span className="font-medium text-white">JWT Bearer</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                <span>Content model</span>
                <span className="font-medium text-white">SitePage / PageSection / FaqItem</span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <Card key={item.label} className="border-slate-200 bg-white">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div className={`rounded-2xl p-3 ${item.tone}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    Hien tai
                  </Badge>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-slate-950">{item.value}</div>
                  <div className="mt-1 text-sm font-medium text-slate-900">{item.label}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-slate-200 bg-white" id="content">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-sky-600" />
                Tien do cac track Phase 5
              </CardTitle>
              <CardDescription>Nhung track dang tac dong truc tiep den kha nang van hanh that cua du an.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {launchTracks.map((item) => (
                <div key={item.name} className="space-y-2 rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-sm text-slate-600">{item.note}</div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{item.progress}%</div>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white" id="leads">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-amber-600" />
                Uu tien tiep theo
              </CardTitle>
              <CardDescription>Danh sach viec can tiep tuc de dashboard phuc vu dung muc tieu STARTECH.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {focusItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-medium text-slate-900">{item.title}</h3>
                    <Badge variant="outline">{item.badge}</Badge>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-slate-200 bg-white" id="projects">
            <CardHeader>
              <CardTitle>Gan voi domain STARTECH hon</CardTitle>
              <CardDescription>Giao dien admin da duoc doi sang ngon ngu portfolio, noi dung va lead.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
              <p>Khong con copy “workflow execution / billing / templates” tu mot SaaS mau.</p>
              <p>Thong tin dashboard nay tap trung vao du an, content model, lead tu form lien he va readiness cho CMS.</p>
              <p>Login page cung da noi that vao backend thay vi chi la component giao dien tinh.</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white" id="settings">
            <CardHeader>
              <CardTitle>Recent Timeline</CardTitle>
              <CardDescription>Nhung moc quan trong de cap nhat vao docs sau khi doi chieu codebase.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActions.map((item) => (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-slate-200 p-4">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.time}</div>
                    <div className="font-medium text-slate-900">{item.title}</div>
                    <div className="text-sm text-slate-600">
                      {item.status === 'done' && 'Da co trong code hoac database.'}
                      {item.status === 'new' && 'Moi duoc them de mo duong cho admin backend/frontend.'}
                      {item.status === 'next' && 'Nen la nhom viec tiep theo sau khi chot docs lan nay.'}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
