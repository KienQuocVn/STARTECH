"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-10 sm:py-12">
      <div className="relative px-4 text-center md:hidden">
        <h1 className="mt-20 text-3xl font-semibold leading-tight text-black/80 sm:text-4xl">
          Thiết kế website
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">chuyên nghiệp</span>
          <br />
          cùng StarTech
        </h1>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Button variant="outline" className="rounded-xl px-6 text-sm sm:text-base" asChild>
            <Link href="/#pricing">Bảng giá chi tiết</Link>
          </Button>

          <Button className="rounded-xl px-6 text-sm sm:text-base" asChild>
            <a href="/lien-he" target="_blank" rel="noopener noreferrer">
              Nhận tư vấn ngay
            </a>
          </Button>
        </div>
      </div>

      <div className="relative flex w-full justify-center px-4 sm:px-6 lg:px-10">
        <motion.div
          className="relative w-full max-w-[1180px] overflow-hidden rounded-2xl sm:rounded-[28px]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative aspect-[1500/923] min-h-[220px] sm:min-h-[360px]">
            <Image
              src="/background/Banner-1500x923.webp"
              alt="StarTech Banner"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 88vw, 1180px"
              className="object-cover"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute left-1/2 top-[9%] z-10 hidden -translate-x-1/2 md:flex"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl shadow-lg lg:px-6">
              <span className="h-2 w-2 rounded-full bg-[#1a63a8] shadow-[0_0_20px_2px_#1a63a8] animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-black/90 lg:text-sm">
                Danh Sách Dự Án Nổi Bật
              </span>
            </div>
          </motion.div>

          <motion.div
            className="absolute left-[5%] top-[6%] w-[40%] sm:w-[28%] md:w-[20%]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative w-full aspect-[300/150]">
              <Image
                src="/background/Group-5.webp"
                alt="686+ đánh giá"
                fill
                sizes="(max-width: 768px) 40vw, 24vw"
                className="object-contain drop-shadow-lg"
              />
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-[10%] left-[6%] w-[22%] sm:w-[16%] md:w-[12%]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="relative w-full aspect-[200/200]">
              <Image
                src="/background/Web-01-741x400.webp"
                alt="500+ dự án"
                fill
                sizes="(max-width: 768px) 22vw, 16vw"
                className="object-contain drop-shadow-lg"
              />
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-[10%] right-[6%] w-[40%] sm:w-[25%] md:w-[18%]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="relative w-full aspect-[768/214]">
              <Image
                src="/background/Web-02-768x214.webp"
                alt="5+ năm kinh nghiệm"
                fill
                sizes="(max-width: 768px) 40vw, 24vw"
                className="object-contain drop-shadow-lg"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="hidden px-4 text-center md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <h1 className="mt-8 text-4xl font-semibold leading-tight text-black/80 lg:text-5xl xl:text-6xl">
          Thiết kế website{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            chuyên nghiệp
          </span>
          <br />
          cùng StarTech
        </h1>

        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline" className="rounded-xl px-8 text-sm lg:text-base" asChild>
            <Link href="/#pricing">Bảng giá chi tiết</Link>
          </Button>

          <Button className="rounded-xl px-8 text-sm lg:text-base" asChild>
            <a href="https://m.me/206950939178338" target="_blank" rel="noopener noreferrer">
              Nhận tư vấn ngay
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
