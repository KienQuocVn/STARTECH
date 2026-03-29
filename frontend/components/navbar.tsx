"use client";

import { useState, useEffect, useCallback } from 'react';
// 1. Nhập usePathname để xác định đường dẫn hiện tại
import { usePathname } from 'next/navigation';
import { Menu } from "@/components/menu";
import Link from "next/link";
import Image from "next/image"; // Đề xuất dùng Image của Next.js

export function Navbar(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  // 2. Sử dụng usePathname để lấy đường dẫn hiện tại
  const pathname: string | null = usePathname();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Helper component để render các liên kết
  interface NavLinkProps {
    href: string;
    label: string;
  }

  const NavLink = ({ href, label }: NavLinkProps) => {
    // 3. So sánh pathname hiện tại với href để xác định active
    // Dùng .startsWith để xử lý các trang con (ví dụ: /dich-vu/chi-tiet)
    const isActive: boolean = pathname === href || (href !== '/' && pathname?.startsWith(href));

    const activeClasses: string = 'text-[#1a63a8] font-medium';
    const inactiveClasses: string = 'text-gray-700';

    return (
      <Link
        href={href}
        // Thay đổi thẻ <a> thành <Link> để sử dụng router của Next.js
        className={`navbar-center__link relative text-sm transition-colors hover:text-[#1a63a8] ${
          isActive ? activeClasses : inactiveClasses
        }`}
      >
        {label}
        {/* Chỉ hiển thị gạch chân nếu link đang active */}
        {isActive && (
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#1a63a8]"></span>
        )}
      </Link>
    );
  };

  return (
    <>
      <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 max-w-[1400px] mx-auto">
          {/* LEFT WRAPPER */}
          <div className="navbar-left flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon/logo.png"
                alt="STARTECH"
                width={160}
                height={50}
                className="object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            </Link>



            <div className="navbar-left__divider w-px h-6 bg-gray-300 hidden sm:block"></div>
          </div>

          {/* CENTER WRAPPER (Navigation Links) */}
          <div className="navbar-center hidden lg:flex items-center gap-8">
            {/* 4. Sử dụng NavLink component đã được sửa đổi */}
            <NavLink href="/" label="Trang chủ" />
            <NavLink href="/dich-vu" label="Dịch vụ" />
            <NavLink href="/du-an" label="Dự án" />
            <NavLink href="/thiet-ke-website" label="Thiết kế website" />
          </div>

          {/* RIGHT WRAPPER */}
          <div className="navbar-right flex items-center gap-6">
            <Link
              href="/lien-he"
              aria-label="Liên hệ button"
              className="cta-button hidden sm:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#80d8f9] to-[#1a63a8] text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <span className="btn-text">Liên hệ</span>
              <span className="cta-arrow transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.46054 0.646175L4.46053 2.42847L9.06702 2.42847L0.152926 10.1178L1.30269 11.4507L10.2168 3.76136L10.2168 8.55799L12.1526 8.55799L12.1526 0.646163L4.46054 0.646175Z" fill="white"/>
                </svg>
              </span>
            </Link>

            <div className="navbar-right__divider w-px h-6 bg-gray-300 hidden sm:block"></div>

            <button
              className="navbar-right__menu-button relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={`navbar__menu-bar block w-6 h-0.5 bg-gray-900 transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}></span>
              <span className={`navbar__menu-bar block w-6 h-0.5 bg-gray-900 transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-0.5' : ''
              }`}></span>
            </button>
          </div>
        </div>
      </nav>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}