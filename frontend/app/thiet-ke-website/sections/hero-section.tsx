import Link from "next/link";
import LaptopComponent from '@/components/3DModel/LaptopComponent';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#FCF9F7] pt-16">
      <div className="absolute left-1/2 top-[120px] -z-10 hidden -translate-x-[380px] sm:block">
        <span className="block h-[120px] w-[120px] rounded-[40px] bg-gradient-to-r from-[#4ce6df] to-[#4ce6df] blur-[40px]"></span>
      </div>
      <div className="absolute right-[10%] top-[100px] -z-10 hidden sm:block">
        <span className="block h-[96px] w-[96px] rounded-[36px] bg-gradient-to-r from-[#4ce6df] to-[#4ce6df] blur-[36px]"></span>
      </div>

      <div className="container relative mx-auto flex flex-col items-center px-4 text-center sm:px-6">
        <h1 className="mt-16 text-3xl font-extrabold uppercase leading-tight text-[#1a1a1a] sm:text-4xl md:text-5xl lg:text-6xl">
          Thiết kế website chuyên nghiệp
          <br />
          <span className="text-[#1a63a8]">Chuẩn SEO - Trọn gói - Uy tín</span>
        </h1>

        <div className="mb-8 mt-5 max-w-3xl text-left text-sm leading-7 text-gray-700 sm:text-center sm:text-base sm:leading-8 md:text-lg">
          <p className="mb-3">
            Công ty <strong>thiết kế website chuyên nghiệp, uy tín</strong> StarTech mang đến giải pháp thiết kế
            website tối ưu và hiệu quả, giúp doanh nghiệp thu hút khách hàng tiềm năng, gia tăng doanh số và chinh
            phục thị trường kinh doanh trực tuyến.
          </p>
          <p>
            Với hơn 5 năm kinh nghiệm, chúng tôi đã có trên 3000 dự án <strong>thiết kế web</strong> vận hành hiệu
            quả, nhận được sự tin tưởng của hàng ngàn cá nhân, doanh nghiệp.
          </p>
        </div>

        <Link
          href="/du-an"
          className="rounded-full bg-gradient-to-r from-[#4fafdbff] to-[#1a63a8] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg sm:px-8 sm:text-base"
        >
          Xem mẫu giao diện
        </Link>

        <div className="relative h-[320px] w-full max-w-6xl sm:h-[420px] md:h-[520px] lg:h-[600px]">
          <div className="absolute inset-0 z-10 bg-transparent"></div>
          <div className="relative z-0 mx-auto">
            <LaptopComponent />
          </div>
        </div>
      </div>
    </section>
  );
}
