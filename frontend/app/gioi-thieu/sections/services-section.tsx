import Image from "next/image";

export function ServicesSection() {
  const services = [
    "Thiết kế website",
    "Thiết kế sàn thương mại điện tử",
    "Thiết kế Mobile App",
    "Thiết kế Web App",
    "Dịch vụ SEO",
    "Quản trị website",
    "Hosting - Domain",
    "Dịch vụ quảng cáo đa kênh",
    "Thiết kế Branding - Thương hiệu",
    "Chụp hình thương hiệu",
    "Đăng ký website với Bộ Công thương",
  ];

  return (
    <section className="about-group-3 py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h3 className="text-[#1a63a8] text-sm md:text-base uppercase tracking-wider font-medium">
                Những dịch vụ nổi bật
              </h3>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 leading-tight">
                Làm việc tận tâm <br className="hidden sm:block" />
                đã tạo nên uy tín <br className="hidden sm:block" />
                cho <span className="text-[#1a63a8]">StarTech</span>
              </h2>
            </div>

            <ul className="space-y-3">
              {services.map((service, index) => (
                <li
                  key={index}
                  className="flex items-start justify-center lg:justify-start gap-3 text-gray-700 hover:text-[#1a63a8] transition-colors"
                >
                  <span className="text-[#1a63a8] mt-1 flex-shrink-0">▸</span>
                  <span className="text-base sm:text-lg">{service}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <a
                href="#"
                className="inline-block w-full sm:w-auto text-center bg-gradient-to-r from-[#80d8f9] to-[#1a63a8] text-white font-medium px-8 py-3 rounded-full hover:opacity-90 transition-all shadow-md"
              >
                Xem tất cả dịch vụ
              </a>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full h-[250px] sm:h-[320px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/img/dich-vu-thiet-ke-website-xay-dung.png"
              alt="Thiết kế website giới thiệu sản phẩm đẹp, chuyên nghiệp"
              fill
              priority
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 60vw"
              className="object-contain md:object-cover object-center"
              quality={90}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
