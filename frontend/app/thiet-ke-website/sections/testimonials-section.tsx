"use client"

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Chị Hà - Chủ shop Minigo",
    content:
      "Từ sau đại dịch, tôi nhận thức được rằng một website bán hàng là điều cần thiết cho việc phát triển kinh doanh hiện nay. StarTech đã không chỉ hỗ trợ nhiệt tình trong giai đoạn thiết kế website mà còn hướng dẫn tôi vận hành website chu đáo. Chỉ trong 1 năm triển khai bán hàng trên website mà shop tôi đã có lượng đơn đặt hàng tăng vượt trội, chạm mốc trên 1000 đơn 1 tháng.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  },
  {
    name: "Anh Hưng - Công ty TNHH Meon Việt Nam",
    content:
      "Từ xưởng sản xuất nội thất nhỏ với số đơn đặt hàng hạn chế mỗi tháng, tôi đã quyết định thiết kế website và sử dụng những giải pháp hỗ trợ Marketing toàn diện tại StarTech. Kết quả đạt được sau quá trình vận hành website vượt xa những kỳ vọng ban đầu của tôi, website được rất nhiều người biết đến, đơn đặt hàng liên tục gia tăng.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  },
  {
    name: "Chị Phụng - Công ty TNHH Tư vấn Diệp Gia",
    content:
      "Tôi đã vô cùng ấn tượng khi xem trang web của StarTech và liên hệ ngay với đơn vị để hợp tác xây dựng website. StarTech đã đáp ứng tốt những yêu cầu đề ra của tôi: website đẹp mắt, nội dung bố trí rõ ràng, hình ảnh sắc nét. Đội ngũ nhân viên luôn hỗ trợ tư vấn và giải đáp kịp thời khiến tôi cảm thấy rất hài lòng.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase text-center font-bold mb-10 sm:mb-16 text-gray-900 tracking-wide">
          Khách hàng nói về <span className="text-[#1a63a8]">StarTech</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Nội dung lời nhận xét */}
          <div className="bg-gradient-to-br from-[#f5f2ee] to-[#faf8f5] rounded-2xl p-6 sm:p-10 relative shadow-lg">
            <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-[#1a63a8] mb-4 opacity-60" />

            <p className="text-gray-700 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
              {currentTestimonial.content}
            </p>

            <div className="flex items-center gap-4 sm:gap-6">
              <img
                src={currentTestimonial.image}
                alt={currentTestimonial.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                  {currentTestimonial.name}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-6 sm:mt-8">
              <button
                onClick={handlePrev}
                className="p-2 sm:p-3 rounded-full border-2 border-gray-300 hover:border-[#1a63a8] hover:bg-[#1a63a8] hover:text-white transition-all"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 sm:p-3 rounded-full border-2 border-gray-300 hover:border-[#1a63a8] hover:bg-[#1a63a8] hover:text-white transition-all"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Hình ảnh minh họa */}
          <div className="rounded-2xl overflow-hidden shadow-2xl max-h-[400px] sm:max-h-[500px] lg:max-h-full">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop"
              alt="Team working"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Dấu chấm chuyển slide */}
        <div className="flex justify-center gap-2 mt-8 sm:mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[#1a63a8] w-8"
                  : "bg-gray-300 w-3 hover:bg-gray-400"
              }`}
              aria-label={`Chuyển đến lời nhận xét ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
