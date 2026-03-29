import Image from 'next/image';

const steps = [
  {
    step: '01',
    title: 'Tiếp nhận mục tiêu',
    desc: 'Làm rõ sản phẩm, khách hàng mục tiêu và kỳ vọng chuyển đổi trước khi triển khai giao diện.',
    image: '/img/giao-dien-responsive.png',
  },
  {
    step: '02',
    title: 'Đề xuất cấu trúc và wireframe',
    desc: 'Xây dựng sitemap, phân nhóm nội dung và luồng CTA để tối ưu trải nghiệm sử dụng.',
    image: '/img/Tablet 1.webp',
  },
  {
    step: '03',
    title: 'Thiết kế giao diện',
    desc: 'Thiết kế layout sáng, hiện đại, đồng bộ thương hiệu và mô phỏng trải nghiệm trên đa thiết bị.',
    image: '/img/Tablet 2.webp',
  },
  {
    step: '04',
    title: 'Lập trình và tích hợp',
    desc: 'Hoàn thiện giao diện, kết nối form, đo lường, SEO cơ bản và các tính năng cần thiết.',
    image: '/img/giao-dien-responsive.png',
  },
  {
    step: '05',
    title: 'Kiểm thử và tinh chỉnh',
    desc: 'Kiểm tra hiển thị, tốc độ, nội dung và luồng chuyển đổi trước khi bàn giao chính thức.',
    image: '/img/Tablet 1.webp',
  },
  {
    step: '06',
    title: 'Bàn giao và đồng hành',
    desc: 'Hướng dẫn sử dụng, hỗ trợ cập nhật và theo dõi hiệu quả sau khi website đi vào vận hành.',
    image: '/img/Tablet 2.webp',
  },
];

export default function ProcessSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="absolute left-1/2 top-28 hidden h-[calc(100%-220px)] w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(23,199,192,0.05),rgba(23,199,192,0.4),rgba(23,199,192,0.05))] lg:block" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center" data-reveal>
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1a63a8]">Quy trình triển khai</span>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1d4350] sm:text-4xl lg:text-5xl">
            Làm việc rõ ràng theo từng giai đoạn để đảm bảo tiến độ và chất lượng
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#5b7881] sm:text-base sm:leading-8">
            Cấu trúc timeline được chia theo các bước dễ theo dõi, phù hợp với kiểu trình bày trong ảnh mẫu và tiện để
            tái sử dụng cho các trang dịch vụ khác sau này.
          </p>
        </div>

        <div className="mt-16 space-y-10 lg:space-y-14">
          {steps.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.step}
                className={`grid items-center gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,420px)] lg:justify-center lg:gap-12 ${isEven ? '' : 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1'}`}
                data-reveal
              >
                <div className="flex justify-center">
                  <div className="relative h-[280px] w-[280px] sm:h-[320px] sm:w-[320px]">
                    <div className="absolute -left-3 -top-3 h-20 w-20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-3 -right-3 h-20 w-20 rounded-full blur-2xl" />
                    <div className="relative h-full w-full overflow-hidden rounded-full border-[10px] border-white">
                      <Image src={item.image} alt={item.title} width={420} height={420} className="h-full w-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className={`relative w-full ${isEven ? 'lg:pl-10' : 'lg:pr-10'} text-left`}>
                  <div className="mt-4 ms-5 lg:mt-0">
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9aaeb3]">Bước {item.step}</div>
                    <h3 className="mt-3 text-2xl font-bold text-[#214957]">{item.title}</h3>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-[#58757e] sm:text-base sm:leading-8">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
