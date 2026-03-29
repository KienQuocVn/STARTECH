"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const benefits = [
  { number: "01", title: "Tiếp cận khách hàng 24/7, không giới hạn thời gian" },
  { number: "02", title: "Quảng bá sản phẩm/dịch vụ hiệu quả hơn" },
  { number: "03", title: "Tăng độ uy tín và chuyên nghiệp cho thương hiệu" },
  { number: "04", title: "Xây dựng kênh bán hàng ổn định, lâu dài" },
  { number: "05", title: "Phân tích hành vi người dùng để tối ưu chiến lược" },
  { number: "06", title: "Tiết kiệm chi phí hơn marketing truyền thống" },
  { number: "07", title: "Hỗ trợ chiến dịch marketing đa kênh" },
  { number: "08", title: "Thiết kế UX/UI giúp tăng tỉ lệ chuyển đổi" },
  { number: "09", title: "Tăng khả năng cạnh tranh trên thị trường số" },
];

export function BenefitsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // 🧠 Tự động cập nhật itemsPerPage theo kích thước màn hình
  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 640) setItemsPerPage(1); // mobile
      else if (window.innerWidth < 1024) setItemsPerPage(2); // tablet
      else setItemsPerPage(3); // desktop
    };
    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const maxIndex = Math.max(0, benefits.length - itemsPerPage);
  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Left - Title + Controls */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <h2 className="uppercase text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-gray-900 leading-snug">
              Thiết kế website chuyên nghiệp mang lại những giá trị gì?
            </h2>

            <div className="flex gap-4 mt-4 sm:mt-6 justify-start lg:justify-start">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-2 rounded-full border-2 border-gray-300 hover:border-[#4fafdbff] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="p-2 rounded-full border-2 border-gray-300 hover:border-[#4fafdbff] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Right - Cards */}
          <div className="flex-1 overflow-hidden">
            <div className="relative">
              <div
                className="flex gap-4 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
              >
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`min-w-[calc(100%/${itemsPerPage}-1rem)] flex-shrink-0`}
                  >
                    <div className="bg-gradient-to-b from-[#efe9e3] to-[#faf5f0] rounded-2xl p-6 sm:p-8 min-h-[220px] sm:min-h-[260px] hover:from-[#4fafdbff] hover:to-[#70caef] hover:text-white transition-all duration-300 hover:-translate-y-3 group cursor-pointer">
                      <div className="text-4xl sm:text-5xl font-bold text-gray-400 group-hover:text-white border-b border-gray-300 group-hover:border-white pb-3 sm:pb-4 mb-3 sm:mb-4 transition-colors">
                        {benefit.number}
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 group-hover:text-white transition-colors">
                        {benefit.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
