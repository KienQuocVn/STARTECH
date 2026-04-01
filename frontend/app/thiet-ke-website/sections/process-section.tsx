"use client";

import Image from "next/image";

const steps = [
  {
    number: "Bước 1",
    title: "Tìm hiểu nhu cầu khách hàng",
    description:
      "Đội ngũ chuyên viên tư vấn của StarTech sẽ sắp xếp meeting với khách hàng để lắng nghe yêu cầu và mong muốn. Dựa vào mục tiêu, chúng tôi tư vấn giải pháp phù hợp và lên kế hoạch thiết kế chi tiết.",
    iconPath: "/img/quytrinh.webp",
  },
  {
    number: "Bước 2",
    title: "Ký hợp đồng",
    description:
      "Sau khi thống nhất phương án, hợp đồng được ký kết để đảm bảo quyền lợi và minh bạch giữa hai bên — là cơ sở pháp lý quan trọng trong quá trình thực hiện.",
    iconPath: "/img/quytrinh2.webp",
  },
  {
    number: "Bước 3",
    title: "Thiết kế giao diện",
    description:
      "StarTech sẽ hiện thực hóa bản thiết kế UI/UX chuyên nghiệp. Bạn sẽ được xem demo, phản hồi và chốt bản thiết kế cuối cùng trước khi chuyển sang lập trình.",
    iconPath: "/img/quytrinh3.webp",
  },
  {
    number: "Bước 4",
    title: "Lập trình website",
    description:
      "Sau khi bản thiết kế được duyệt, đội ngũ developer của StarTech tiến hành code toàn bộ chức năng, đảm bảo website hoạt động ổn định và tương thích đa thiết bị.",
    iconPath: "/img/quytrinh4.webp",
  },
  {
    number: "Bước 5",
    title: "Demo & Chỉnh sửa",
    description:
      "StarTech gửi bản demo trên môi trường thử nghiệm để khách hàng trải nghiệm thực tế. Sau đó đội ngũ tiến hành tinh chỉnh theo góp ý.",
    iconPath: "/img/quytrinh5.webp",
  },
  {
    number: "Bước 6",
    title: "Bàn giao website",
    description:
      "Khi hoàn thiện toàn bộ các khâu, sản phẩm được bàn giao kèm hướng dẫn quản trị. StarTech tiếp tục hỗ trợ bảo trì, nâng cấp khi khách hàng cần.",
    iconPath: "/img/quytrinh6.webp",
  },
];

export function ProcessSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-6 relative">
        {/* HEADER */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[#4fafdb] uppercase font-semibold text-sm sm:text-base tracking-wide mb-2">
            Biến ý tưởng thành hiện thực
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl uppercase font-bold mb-4 text-gray-900 leading-tight">
            Quy trình thiết kế website <br className="hidden sm:block" /> chuyên nghiệp tại StarTech
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
            Với phương châm làm việc lấy khách hàng làm trung tâm, chúng tôi luôn hướng tới các giải pháp hỗ trợ khách hàng 
            trong hoạt động <strong> thiết kế website</strong>. Từ khâu lên ý tưởng, thiết kế giao diện đến lập trình, kiểm 
            thử và bàn giao – từng bước trong quy trình <strong>thiết kế website</strong> của StarTech đều được thực hiện 
            chuyên nghiệp để mang lại sản phẩm chất lượng cao cho khách hàng.
          </p>
        </div>

        {/* GRID STEPS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group bg-gradient-to-b from-[#f8f8f8] to-[#fff] rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl text-gray-300 font-bold uppercase pb-4 border-b border-gray-200 mb-5 group-hover:text-[#4fafdb] transition-colors">
                {step.number}
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-[#1a63a8] mb-3 leading-snug min-h-[2.5rem]">
                {step.title}
              </h3>

              <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed min-h-[7rem]">
                {step.description}
              </p>

              <div className="rounded-2xl overflow-hidden">
                <Image
                  src={step.iconPath}
                  alt={step.title}
                  width={640}
                  height={420}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
