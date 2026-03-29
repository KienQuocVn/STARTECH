import Image from 'next/image';

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="overflow-hidden rounded-[36px] bg-gradient-to-r from-[#80d8f9] to-[#1a63a8]">
          <div className="grid items-center gap-10 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-14 lg:py-14">
            <div className="relative mx-auto w-full max-w-[460px]" data-reveal>
              <div className="absolute left-[-14%] top-[10%] h-28 w-28 rounded-full border border-dashed border-white/60" />
              <div className="absolute right-[-8%] bottom-[4%] h-24 w-24 rounded-full border border-dashed border-white/60" />
              <div className="relative">
                <Image
                  src="/img/Tablet 1.webp"
                  alt="Liên hệ tư vấn dịch vụ StarTech"
                  width={760}
                  height={560}
                  className="h-auto w-full object-contain drop-shadow-[0_24px_40px_rgba(10,88,97,0.2)]"
                />
              </div>
            </div>

            <div className="text-white" data-reveal>
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white/85">Liên hệ ngay hôm nay</span>
              <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Nhận đề xuất giao diện và lộ trình triển khai phù hợp với doanh nghiệp của bạn
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
                Điền thông tin cơ bản, đội ngũ StarTech sẽ liên hệ tư vấn định hướng triển khai, thời gian thực hiện và
                giải pháp phù hợp với mô hình kinh doanh hiện tại.
              </p>

              <form className="mt-8 grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="h-12 rounded-2xl border border-white/25 bg-white/92 px-4 text-sm text-[#1d4350] outline-none placeholder:text-[#6d8790]"
                />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  className="h-12 rounded-2xl border border-white/25 bg-white/92 px-4 text-sm text-[#1d4350] outline-none placeholder:text-[#6d8790]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="h-12 rounded-2xl border border-white/25 bg-white/92 px-4 text-sm text-[#1d4350] outline-none placeholder:text-[#6d8790]"
                />
                <input
                  type="text"
                  placeholder="Lĩnh vực kinh doanh"
                  className="h-12 rounded-2xl border border-white/25 bg-white/92 px-4 text-sm text-[#1d4350] outline-none placeholder:text-[#6d8790]"
                />
                <textarea
                  placeholder="Mô tả ngắn nhu cầu của bạn"
                  className="min-h-[120px] rounded-[24px] border border-white/25 bg-white/92 px-4 py-3 text-sm text-[#1d4350] outline-none placeholder:text-[#6d8790] sm:col-span-2"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#ffffff] px-6 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#113f4f] sm:col-span-2 sm:w-fit"
                >
                  Gửi yêu cầu tư vấn
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
