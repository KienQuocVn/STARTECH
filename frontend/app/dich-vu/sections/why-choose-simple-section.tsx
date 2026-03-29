import Image from 'next/image';
import {
  CheckCircle2,
  CircleDollarSign,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users2,
} from 'lucide-react';

const reasons = [
  {
    title: 'Chiến lược đúng ngay từ đầu',
    desc: 'Phân tích mục tiêu kinh doanh, chân dung khách hàng và hành trình mua để website không chỉ đẹp mà còn chuyển đổi tốt.',
  },
  {
    title: 'Nội dung và cấu trúc rõ ràng',
    desc: 'Tối ưu luồng nội dung, CTA và thông điệp bán hàng để khách truy cập hiểu nhanh giá trị doanh nghiệp.',
  },
  {
    title: 'Vận hành dễ, bàn giao minh bạch',
    desc: 'Hệ thống quản trị thân thiện, tài liệu hướng dẫn rõ ràng và đội ngũ đồng hành sau khi bàn giao.',
  },
];

const benefitCards = [
  {
    icon: LayoutDashboard,
    title: 'Thiết kế giao diện thuyết phục',
    desc: 'Bố cục sáng, hiện đại, đồng bộ thương hiệu và tối ưu trải nghiệm xem trên mọi màn hình.',
  },
  {
    icon: CircleDollarSign,
    title: 'Tăng hiệu quả quảng cáo',
    desc: 'Landing page và website được tối ưu để đón traffic từ Google Ads, Facebook Ads và social media.',
  },
  {
    icon: ShieldCheck,
    title: 'Chuẩn bảo mật và vận hành',
    desc: 'Kiểm soát phân quyền, backup định kỳ, tối ưu tốc độ và sẵn sàng mở rộng lâu dài.',
  },
  {
    icon: Users2,
    title: 'Chăm sóc khách hàng tốt hơn',
    desc: 'Tích hợp form, chat, hotline và quy trình xử lý lead để không bỏ lỡ khách hàng tiềm năng.',
  },
];

const miniStats = [
  'SEO onpage và cấu trúc nội dung chuẩn tìm kiếm',
  'Tối ưu CTA, biểu mẫu và luồng chuyển đổi',
  'Quản trị nội dung dễ dùng cho đội ngũ nội bộ',
  'Sẵn sàng tích hợp CRM, chatbot và tracking',
];

export default function WhyChooseSimple() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f9fbfa_0%,#ffffff_42%,#f8fcfb_100%)] py-20 sm:py-24">
      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center" data-reveal>
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1a63a8]">
            Nổi bật
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1c4250] sm:text-4xl lg:text-5xl">
            Một website không chỉ đẹp mà còn phải hỗ trợ bán hàng mỗi ngày
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#54737d] sm:text-base sm:leading-8">
            Chúng tôi thiết kế website theo hướng tăng niềm tin, tối ưu trải nghiệm và giúp doanh
            nghiệp có nền tảng marketing ổn định trong dài hạn.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="relative mx-auto w-full max-w-[620px]" data-reveal>
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(179,247,239,0.55),transparent_70%)] blur-3xl" />
            <div className="relative overflow-hidden rounded-[34px] border border-white/60 bg-white/75 p-4 shadow-[0_28px_60px_rgba(34,121,133,0.12)] backdrop-blur sm:p-6">
              <div className="relative overflow-hidden rounded-[28px] bg-[#eafffb]">
                <Image
                  src="/img/giao-dien-responsive.png"
                  alt="Lợi ích khi thiết kế website cùng StarTech"
                  width={920}
                  height={720}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            <div className="absolute -bottom-6 left-6 max-w-[260px] rounded-[26px] border border-white/70 bg-white/90 p-5 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1a63a8]/15 text-[#1a63a8]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1c4250]">Tối ưu cho tăng trưởng</div>
                  <div className="text-xs text-[#62808a]">
                    Thiết kế, SEO và nội dung cùng một hướng
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5" data-reveal>
            {reasons.map((item, index) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-[28px] border border-[#dcefea] bg-white/85 p-5 shadow-[0_16px_36px_rgba(22,114,126,0.08)] backdrop-blur"
              >
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#1a63a8] text-sm font-bold text-white shadow-lg">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#214957]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#58757e]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-[1.05fr_0.95fr]" data-stagger>
          <div className="grid gap-5 sm:grid-cols-2">
            {benefitCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[28px] border border-[#daf0ea] bg-white p-6 shadow-[0_16px_36px_rgba(33,115,128,0.08)] transition-transform duration-300 hover:-translate-y-1 flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a63a8]/12 text-[#1a63a8]">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-[#1f4654]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#5d7a83]">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[34px] bg-[linear-gradient(145deg,#f5f1ea_0%,#fffdfa_48%,#ffffff_100%)] p-7 shadow-[0_20px_44px_rgba(28,66,80,0.08)] sm:p-8">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c9e83]">
              Hỗ trợ lâu dài
            </span>
            <h3 className="mt-3 max-w-md text-2xl font-bold leading-tight text-[#274551] sm:text-3xl">
              Đồng hành từ lúc lên ý tưởng đến khi website đi vào vận hành
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#617983] sm:text-base sm:leading-8">
              StarTech không chỉ bàn giao giao diện. Chúng tôi xây dựng cấu trúc nội dung, định
              hướng tính năng, tối ưu SEO nền tảng và hỗ trợ đội ngũ của bạn khai thác website hiệu
              quả hơn mỗi tuần.
            </p>

            <div className="mt-8 space-y-4">
              {miniStats.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-[#1a63a8]" />
                  <span className="text-sm leading-7 text-[#45646e]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
