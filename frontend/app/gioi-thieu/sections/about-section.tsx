import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export function AboutSection() {
  const highlights = [
    "Đội ngũ chuyên gia giàu kinh nghiệm",
    "Công nghệ hiện đại, tiên tiến",
    "Giải pháp tùy chỉnh theo nhu cầu",
    "Hỗ trợ 24/7",
    "Bảo mật thông tin tuyệt đối",
    "Chi phí hợp lý, hiệu quả cao",
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-800 leading-tight">
              VÌ SAO NÊN CHỌN<br />
              LÀM VIỆC - SÁNG TẠO VỚI<br />
              <span className="text-[#1a63a8]">STARTECH?</span>
            </h2>

            <div className="space-y-4">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 justify-center lg:justify-start"
                >
                  <CheckCircle2 className="w-6 h-6 text-[#1a63a8] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-base md:text-lg">{item}</p>
                </div>
              ))}
            </div>

            <button className="mt-6 bg-gradient-to-r from-[#80d8f9] to-[#1a63a8] text-white px-8 py-3 rounded-full hover:bg-teal-600 transition-all duration-200 shadow-md">
              Tìm hiểu thêm
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full h-64 sm:h-80 md:h-[420px] lg:h-[480px]">
            <Image
              src="/img/professional-web-design-team.jpg"
              alt="Thiết kế website giới thiệu sản phẩm đẹp, chuyên nghiệp"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-contain md:object-cover object-center rounded-xl shadow-lg"
              quality={90}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
