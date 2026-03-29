import Image from "next/image";

export function Hero() {
  return (
    <section className="relative w-full h-screen">
      {/* Background Image */}
      <Image
        src="/img/thiet-ke-web-site-tai-vinh-phuc-2.png"
        alt="Thiết kế website giới thiệu sản phẩm đẹp, chuyên nghiệp"
        fill
        priority
        sizes="90vw"
        className="object-cover object-center"
        quality={90}
      />

     

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 ">
        <div className="bg-gradient-to-r from-[rgba(128,216,249,0.7)] to-[rgba(26,99,168,0.7)] p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg text-white">
            Chúng tôi
          </h1>
          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl max-w-3xl drop-shadow-md text-white">
            Sở hữu những chiến binh giàu kinh nghiệm thực chiến
          </p>
        </div>

      </div>
    </section>
  );
}
