import Link from 'next/link';
import { ArrowRight, BadgeCheck, Clock3, ShieldCheck, Users } from 'lucide-react';

const trustPoints = [
  {
    icon: BadgeCheck,
    title: 'Quy trinh ro rang',
    description: 'Kickoff, demo, nghiem thu va ban giao duoc thong nhat ngay tu dau.',
  },
  {
    icon: Clock3,
    title: 'SLA phan hoi nhanh',
    description: 'Ho tro phan hoi trong gio hanh chinh va uu tien xu ly issue quan trong.',
  },
  {
    icon: ShieldCheck,
    title: 'Bao hanh sau ban giao',
    description: 'Theo doi van hanh, sua loi phat sinh va huong dan doi ngu su dung.',
  },
  {
    icon: Users,
    title: 'Dong hanh cung team kinh doanh',
    description: 'Tap trung vao lead, ti le chuyen doi va hinh anh thuong hieu thay vi chi lam dep giao dien.',
  },
];

interface ConversionBandProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function ConversionBand({ eyebrow, title, description }: ConversionBandProps) {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16">
      <div className="container mx-auto">
        <div className="overflow-hidden rounded-[32px] border border-[var(--brand-border)] bg-white shadow-[0_24px_60px_rgba(26,99,168,0.08)]">
          <div className="brand-soft-bg grid gap-10 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 lg:py-12">
            <div className="max-w-2xl" data-reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-primary)]">{eyebrow}</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--brand-ink)] sm:text-4xl">{title}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--brand-muted)] sm:text-base sm:leading-8">{description}</p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/lien-he"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/50 transition-transform hover:-translate-y-0.5 brand-gradient sm:text-base"
                >
                  Nhan bao gia
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/lien-he"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-surface)] sm:text-base"
                >
                  Dat lich tu van
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2" data-stagger>
              {trustPoints.map((point) => {
                const Icon = point.icon;

                return (
                  <div
                    key={point.title}
                    className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_10px_30px_rgba(26,99,168,0.06)] backdrop-blur"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[var(--brand-ink)]">{point.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{point.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
