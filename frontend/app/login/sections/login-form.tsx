'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAdmin } from '@/lib/services/auth';
import { cn } from '@/lib/utils';

const defaultCredentials = {
  email: 'admin@startech.local',
  password: 'Startech@2026',
};

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultCredentials.email);
  const [password, setPassword] = useState(defaultCredentials.password);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await loginAdmin(email, password);
      router.push('/admin');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Dang nhap that bai.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn('flex flex-col gap-5', className)} {...props}>
      <Card className="overflow-hidden border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
        <CardContent className="grid p-0 lg:grid-cols-[1.15fr_0.85fr]">
          <form className="space-y-6 p-7 md:p-10" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Khu vuc quan tri STARTECH
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Dang nhap de quan ly noi dung va lead</h1>
                <p className="max-w-xl text-sm leading-6 text-slate-600">
                  Form nay da duoc noi voi backend auth co JWT. Sau khi dang nhap, ban co the tiep tuc mo rong sang CRUD
                  du an, site content, feedback va dashboard CMS.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email quan tri</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@startech.local"
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mat khau</Label>
                  <span className="text-xs text-slate-500">JWT, bcrypt, role-based foundation</span>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Nhap mat khau"
                  required
                />
              </div>
            </div>

            {error ? (
              <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <Button
              type="submit"
              className="h-11 w-full bg-slate-950 text-white hover:bg-slate-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Dang kiem tra tai khoan...' : 'Dang nhap dashboard'}
            </Button>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                <LockKeyhole className="h-4 w-4" />
                Tài khoản seed mặc định
              </div>
              <p>
                Email: <span className="font-mono text-slate-900">kieukienquocbussiness@gmail.com</span>
              </p>
              <p>
                Mat khau: <span className="font-mono text-slate-900">Startech@2026</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Phiên đăng nhập admin hiện được lưu bằng cookie an toàn hơn thay vì `localStorage`.
              </p>
            </div>
          </form>

          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_#fef3c7,_#fff7ed_35%,_#e2e8f0_100%)] p-7 md:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.08),transparent_45%,rgba(249,115,22,0.16))]" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Phase 5 dang bat dau tu admin foundation
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">STARTECH CMS</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-slate-950">
                    Chuyển từ website giới thiệu sang một hệ thống vận hành nội dung gọn, dễ mở rộng.
                  </h2>
                </div>
              </div>

              <div className="space-y-3 rounded-3xl bg-slate-950 p-6 text-slate-100 shadow-xl">
                <p className="text-sm text-slate-300">Hướng dẫn sau bước đăng nhập này:</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <ArrowRight className="mt-0.5 h-4 w-4 text-amber-300" />
                    Quan ly lead lien he, trang noi dung va danh muc du an trong mot dashboard.
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="mt-0.5 h-4 w-4 text-amber-300" />
                    Dat nen cho role `SUPER_ADMIN / EDITOR / VIEWER` de mo rong CMS va workflow duyet noi dung.
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="mt-0.5 h-4 w-4 text-amber-300" />
                    Giu backend gan voi domain STARTECH thay vi mot template SaaS chung chung.
                  </li>
                </ul>

                <Link href="/trang-chu" className="inline-flex items-center gap-2 text-sm text-amber-200 hover:text-white">
                  Quay ve website cong khai
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
