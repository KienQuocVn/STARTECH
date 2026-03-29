import Image from "next/image";

export function AboutIntroSection() {
  return (
    <section className="about-group-2 py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Hình ảnh */}
        <div className="relative w-full max-w-4xl mx-auto h-[250px] sm:h-[320px] md:h-[400px] lg:h-[500px] mb-8 md:mb-12">
          <Image
            src="/img/dich-vu-thiet-ke-website-xay-dung.png"
            alt="Thiết kế website giới thiệu sản phẩm đẹp, chuyên nghiệp"
            fill
            priority
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 60vw"
            className="object-contain md:object-cover object-center rounded-lg shadow-lg"
            quality={90}
          />
        </div>

        {/* Nội dung */}
        <div className="max-w-4xl mx-auto text-center space-y-6 px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800">
            Chúng tôi là
          </h2>

          <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed">
            Đội ngũ <span className="font-semibold text-[#1a63a8]">StarTech</span> với kinh nghiệm tham gia nhiều cuộc chiến
            trong nhiều năm liền ở thị trường Marketing, giờ đây chúng tôi chính thức là một đội quân hùng mạnh với mong muốn
            đồng hành và phát triển cùng bạn trong những cuộc chiến sắp tới, thông qua các dịch vụ và giải pháp Marketing hiệu quả.
          </p>
        </div>
      </div>
    </section>
  );
}
