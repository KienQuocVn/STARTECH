import Image from "next/image";
import { Play } from "lucide-react";

export function ValuesSection() {
  const values = [
    {
      number: "01",
      title: "Sáng tạo",
      description:
        "Sáng tạo trong phong cách thiết kế và luôn cập nhật xu hướng mới thường xuyên. Sản phẩm bạn nhận được là sự hội tụ của sáng tạo, chất lượng và độc đáo.",
    },
    {
      number: "02",
      title: "Kinh nghiệm",
      description:
        "Kinh nghiệm chiến đấu nhiều năm trên chiến trường Marketing, đội ngũ chiến binh STARTECH sẽ giúp bạn giải quyết vấn đề một cách dễ dàng và tiết kiệm.",
    },
    {
      number: "03",
      title: "Thấu hiểu",
      description:
        "Trải qua nhiều cuộc chiến, STARTECH dễ dàng nhìn nhận và thấu hiểu vấn đề một cách nhanh chóng.",
    },
    {
      number: "04",
      title: "Đa dạng",
      description:
        "STARTECH có hệ sinh thái Marketing đa dịch vụ hỗ trợ lẫn nhau, bền vững và lâu dài.",
    },
  ];

  const diversityItems = [
    "Sử dụng nhiều ngôn ngữ lập trình",
    "Nhiều đối tác liên kết",
    "Hệ sinh thái Marketing",
    "Sáng tạo trong thiết kế",
  ];

  return (
    <>
      {/* GIÁ TRỊ KHÁC BIỆT */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Text */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-800 leading-tight">
                Giá trị khác biệt tại STARTECH
              </h2>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                STARTECH sở hữu đội ngũ chiến binh dày dặn kinh nghiệm thực chiến
                trên thị trường Marketing. Chúng tôi luôn trong tâm thế sẵn sàng
                tham gia bất kỳ cuộc chiến nào cùng với doanh nghiệp bạn.
              </p>
            </div>

            {/* Right Values */}
            <div className="space-y-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="border-l-4 border-[#1a63a8] pl-6 py-4 bg-white/70 rounded-md shadow-sm hover:shadow-md transition"
                >
                  <div className="text-5xl md:text-6xl text-[#1a63a8]/20 mb-2 font-bold">
                    {value.number}
                  </div>
                  <h3 className="text-xl md:text-2xl text-gray-800 mb-3 font-semibold">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Video Image */}
            <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] group overflow-hidden rounded-2xl">
              <Image
                src="/img/dich-vu-thiet-ke-website-xay-dung.png"
                alt="Thiết kế website giới thiệu sản phẩm đẹp, chuyên nghiệp"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
                quality={90}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-[#1a63a8] ml-1" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-800 leading-tight">
                Không ngừng nỗ lực nâng cao chất lượng dịch vụ
              </h2>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Chiến binh của chúng tôi không ngừng nỗ lực mang đến cho bạn
                những trải nghiệm dịch vụ tốt nhất, sẵn sàng hỗ trợ 24/7 để giải
                đáp mọi khó khăn trong quá trình sử dụng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHIẾN LỢI PHẨM */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-800 leading-tight">
                Chiến lợi phẩm sau bao ngày ra trận của STARTECH
              </h2>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Đội ngũ STARTECH luôn tận tâm và nhiệt huyết nhằm đem đến những
                sản phẩm giá trị cho khách hàng — nhờ vậy mà những dự án thiết kế
                website ra đời luôn vận hành thành công và hiệu quả.
              </p>
              <a
                href="#"
                className="inline-block bg-[#1a63a8] text-white px-8 py-3 rounded-full hover:bg-[#154f84] transition-colors"
              >
                Xem thêm
              </a>
            </div>

            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              <Image
                src="/img/dich-vu-thiet-ke-website-xay-dung.png"
                alt="Thiết kế website giới thiệu sản phẩm đẹp, chuyên nghiệp"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center rounded-lg shadow-lg"
                quality={90}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ĐIỂM ĐA DẠNG */}
      <section className="relative py-32 md:py-40">
        <div className="absolute inset-0">
          <Image
            src="/img/dich-vu-thiet-ke-website-xay-dung.png"
            alt="Background StarTech"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#1a63a8]/90"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-8 md:mb-12 border-b-4 border-white pb-2 inline-block">
            Điểm đa dạng của STARTECH
          </h2>

          <div className="space-y-4 mb-12">
            {diversityItems.map((item, index) => (
              <div
                key={index}
                className="text-white text-lg md:text-xl py-3 border-b border-white/30 hover:border-white transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="absolute left-0 right-0 -bottom-20 z-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
              <p className="text-gray-700 text-lg md:text-xl mb-6 leading-relaxed">
                Ngay bây giờ chính là thời điểm sớm nhất<br />
                Bước gần hơn đến thành công của bạn bằng cách trò chuyện với chúng tôi.
              </p>
              <a
                href="/lien-he"
                className="inline-block bg-[#1a63a8] text-white px-10 py-4 rounded-full hover:bg-[#154f84] transition-colors"
              >
                Liên hệ ngay
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="h-32 bg-white"></div>
    </>
  );
}
