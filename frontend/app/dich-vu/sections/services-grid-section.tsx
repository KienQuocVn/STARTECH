'use client';

import { motion, Variants } from 'framer-motion';
import { BarChart3, LayoutTemplate, Megaphone, SearchCheck, ServerCog, ShieldEllipsis } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  description: string;
  features: string[];
  icon: typeof LayoutTemplate;
}

const services: Service[] = [
  {
    id: 1,
    title: 'Thiết kế website doanh nghiệp',
    description: 'Xây dựng website giới thiệu dịch vụ, năng lực công ty và hệ thống landing page bám sát hành trình khách hàng.',
    features: ['Chuẩn responsive', 'Cấu trúc nội dung rõ ràng', 'CTA theo mục tiêu kinh doanh'],
    icon: LayoutTemplate,
  },
  {
    id: 2,
    title: 'Website bán hàng và tối ưu chuyển đổi',
    description: 'Thiết kế giao diện bán hàng hiện đại, giúp khách truy cập dễ tìm sản phẩm, dễ ra quyết định và dễ liên hệ.',
    features: ['Luồng mua hàng trực quan', 'Tối ưu mobile', 'Form và chat tích hợp'],
    icon: BarChart3,
  },
  {
    id: 3,
    title: 'SEO nền tảng và nội dung',
    description: 'Tối ưu cấu trúc trang, heading, schema, tốc độ và nội dung để website có nền tảng tốt cho SEO dài hạn.',
    features: ['SEO technical', 'Tối ưu heading/meta', 'Sẵn sàng mở rộng content'],
    icon: SearchCheck,
  },
  {
    id: 4,
    title: 'Quản trị và cập nhật website',
    description: 'Đồng hành cập nhật nội dung, banner, landing page và chăm sóc vận hành định kỳ cho đội ngũ nội bộ.',
    features: ['Cập nhật nội dung', 'Chỉnh sửa giao diện', 'Báo cáo định kỳ'],
    icon: ServerCog,
  },
  {
    id: 5,
    title: 'Triển khai quảng cáo đa kênh',
    description: 'Kết nối website với các chiến dịch Google Ads, Facebook Ads và đo lường để không lãng phí ngân sách.',
    features: ['Tracking rõ ràng', 'Remarketing', 'Tối ưu landing page'],
    icon: Megaphone,
  },
  {
    id: 6,
    title: 'Bảo trì và bảo mật',
    description: 'Giám sát hiệu năng, vá lỗi, backup và kiểm soát rủi ro để website vận hành ổn định và an toàn.',
    features: ['Backup định kỳ', 'Bảo mật cơ bản', 'Kiểm tra hiệu suất'],
    icon: ShieldEllipsis,
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: custom * 0.08,
      ease: 'easeOut',
    },
  }),
};

export function ServicesGridSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center" data-reveal>
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1a63a8]">Dịch vụ chính</span>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1b4350] sm:text-4xl lg:text-5xl">
            Các hạng mục giúp website vận hành hiệu quả từ nền tảng đến tăng trưởng
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#58757f] sm:text-base sm:leading-8">
            Mỗi gói dịch vụ được thiết kế để giải quyết một nhóm nhu cầu cụ thể, nhưng vẫn liên kết chặt chẽ để hỗ trợ
            doanh nghiệp phát triển lâu dài.
          </p>
        </div>

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          {services.map((service, index) => (
            <motion.div key={service.id} variants={cardVariants} custom={index}>
              <div
                className="group relative h-full overflow-hidden rounded-[30px] border border-[#d9efea]  p-7 "
                data-parallax
                data-tilt
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[42px] bg-[#1a63a8]/8 transition-transform duration-300 group-hover:scale-110" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a63a8]/12 text-[#1a63a8]">
                  <service.icon className="h-7 w-7" />
                </div>

                <div className="relative mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-[#87a0a7]">
                  0{service.id}
                </div>

                <h3 className="relative mt-3 text-2xl font-bold leading-snug text-[#214856]">{service.title}</h3>
                <p className="relative mt-4 text-sm leading-7 text-[#5e7982]">{service.description}</p>

                <ul className="relative mt-6 space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-[#365966]">
                      <span className="mt-2 h-2 w-2 flex-none rounded-full bg-[#1a63a8]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
