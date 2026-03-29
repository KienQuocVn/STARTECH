const pricingPlans = [
  {
    name: "Landing Page Chuyển Đổi",
    subtitle: "Chạy quảng cáo, thu lead, ra mắt sản phẩm",
    price: "5.000.000",
    features: [
      "Tiêu chuẩn UI/UX cao, tối ưu tỉ lệ chuyển đổi",
      "Phân tích mục tiêu trước khi thiết kế (giới thiệu, thu data, bán hàng)",
      "Thiết kế từng section theo hành vi khách hàng",
      "Tối ưu tốc độ tải trang để chạy quảng cáo tốt",
      "Kết nối với email marketing, CRM,…",
      "Website chuẩn SEO, thân thiện với di động",
      "Tích hợp Form đăng ký",
      "Tích hợp Chatbot, livechat",
      "Popup khuyến mãi, CTA",
      "Bàn giao source code"
    ]
  },
  {
    name: "Website Cơ Bản",
    subtitle: "Cá nhân, hộ kinh doanh nhỏ, làm nhanh gọn",
    price: "8.000.000",
    features: [
      "Giao diện web dựng theo mẫu đề xuất",
      "Chọn mua tên miền và tư vấn gói hosting phù hợp cho doanh nghiệp.",
      "99+ mẫu theme đẹp, độc đáo, đa ngành.",
      "Tùy biến màu sắc theo bộ nhận diện thương hiệu",
      "Responsive trên mọi thiết bị",
      "Thời gian hoàn thành: 15+ ngày",
      "Có thể nâng cấp lên gói cao hơn bất kỳ lúc nào",
      "Backup, bảo trì kỹ thuật (khi mua kèm hosting)",
      "Bàn giao source code"
    ]
  },
  {
    name: "Website Theo Yêu Cầu Doanh Nghiệp",
    subtitle: "Doanh nghiệp vừa, thương hiệu cá nhân mạnh",
    price: "12.000.000",
    features: [
      "Thiết kế UI/UX riêng theo ngành nghề",
      "Chọn mua tên miền và tư vấn gói hosting phù hợp cho doanh nghiệp.",
      "Trang giới thiệu, dịch vụ, sản phẩm, bài viết, liên hệ",
      "Quản lý dễ dàng: thêm/sửa sản phẩm, chỉnh nội dung mà không cần biết code",
      "CMS tùy chỉnh: quản lý nội dung, sản phẩm, bài viết",
      "Website chuẩn SEO, thân thiện với di động",
      "Tích hợp cổng thanh toán (Momo, VNPAY, …), Zalo OA, Fanpage chat",
      "Dashboard quản trị đơn hàng, khách hàng",
      "Có thể mở rộng thành hệ thống CRM hoặc booking sau này",
      "Backup, bảo trì kỹ thuật (khi mua kèm hosting)",
      "Bàn giao source code"
    ]
  },
  {
    name: "Website Hệ Thống",
    subtitle: "Doanh nghiệp lớn, tổ chức giáo dục, sàn giải trí,...",
    price: "30.000.000",
    features: [
      "Thiết kế toàn bộ hệ thống UI/UX chuyên sâu theo ngành nghề",
      "Chọn mua tên miền và tư vấn gói hosting phù hợp cho doanh nghiệp.",
      "Tư vấn chiến lược & phân tích nghiệp vụ trước khi thiết kế (CMS nâng cao: Module CRM mini",
      "Tùy biến dashboard quản trị theo nhu cầu doanh nghiệp",
      "Hệ thống phân quyền chi tiết (Admin / CSKH / Nhân viên…)",
      "CRM mini theo dõi lịch sử khách hàng, hành vi tương tác",
      "Có thể tích hợp với hệ thống quản lý hiện tại (ERP, LMS…)",
      "Website chuẩn SEO, thân thiện với di động",
      "Bảo hành dài hạn và nâng cấp chức năng",
      "Backup, bảo trì kỹ thuật (khi mua kèm hosting)",
      "Bàn giao source"
    ]
  }
];

export function PricingSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div id="pricing" className="container mx-auto px-5 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Tiêu đề */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase text-center mb-4 leading-snug text-[#1a1a1a]">
            BẢNG GIÁ THIẾT KẾ WEBSITE<br/>
            <span className="text-[#1a63a8]">CHUYÊN NGHIỆP TRỌN GÓI</span>
          </h2>

          <p className="text-center text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mb-10 sm:mb-14 leading-relaxed">
            Tham khảo bảng giá thiết kế website trọn gói, tối ưu chi phí cho từng nhu cầu doanh nghiệp.
            Cam kết giao diện chuyên nghiệp, chuẩn SEO và bảo hành dài hạn.
          </p>

          {/* Grid giá */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className="
                  group relative border-2 border-[#1a63a8] rounded-2xl p-6 sm:p-8 bg-white 
                  hover:bg-gradient-to-b hover:from-[#95ccff] hover:to-[#1a63a8] 
                  hover:-translate-y-4 sm:hover:-translate-y-6 
                  transition-all duration-300 hover:shadow-2xl flex flex-col
                "
              >
                <h3 className="uppercase font-bold text-xl sm:text-2xl mb-2 min-h-[3rem] group-hover:text-white transition-colors text-center">
                  {plan.name}
                </h3>

                <p className="text-xs sm:text-sm mb-4 text-gray-600 group-hover:text-white transition-colors min-h-[2.5rem] text-center leading-snug">
                  {plan.subtitle}
                </p>

                <div className="text-2xl sm:text-3xl font-bold text-[#1a63a8] group-hover:text-white mb-6 transition-colors text-center">
                  {plan.price}
                  <span className="text-sm sm:text-base align-top">đ</span> +
                </div>

                {/* Danh sách tính năng */}
                <ul className="space-y-2 sm:space-y-3 mb-6 text-xs sm:text-sm text-gray-700 group-hover:text-white transition-colors flex-1 leading-relaxed">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#1a63a8] group-hover:text-white mt-1 text-lg">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Nút CTA */}
                <button
                  className="
                    mt-auto w-full py-2.5 sm:py-3 px-6 bg-[#1a63a8] 
                    group-hover:bg-[#95ccff] text-white rounded-full 
                    font-semibold text-sm sm:text-base hover:shadow-lg 
                    transition-all duration-300
                  "
                >
                  <a href="/lien-he">Liên hệ</a>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
