"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Menu({ isOpen, onClose }: MenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const navigationItems = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Thiết kế', href: '/thiet-ke-website' },
    { name: 'Dịch vụ', href: '/dich-vu' },
    { name: 'Dự án', href: '/du-an' },
  ];

  const socialLinks = [
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@kienquocz?lang=vi-VN',
      icon: (
        <svg
          width="11"
          height="13"
          viewBox="0 0 11 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 0V9.1C5.5 9.83454 4.90192 10.4 4.125 10.4C3.34808 10.4 2.75 9.83454 2.75 9.1C2.75 8.36546 3.34808 7.8 4.125 7.8V5.2C1.86317 5.2 0 6.96154 0 9.1C0 11.2385 1.86317 13 4.125 13C6.38683 13 8.25 11.2385 8.25 9.1V4.20215C9.0972 4.77274 9.98129 5.2 11 5.2V2.6C10.9349 2.6 9.98618 2.31522 9.32422 1.76973C8.66226 1.22423 8.25 0.539488 8.25 0H5.5Z"
            fill="#5B6871"
          ></path>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61581525345220',
      icon: (
        <svg
          width="7"
          height="13"
          viewBox="0 0 7 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.38456 2.54348H6.7307C6.87931 2.54348 6.99993 2.41687 6.99993 2.26087V0.356935C6.99993 0.208848 6.89143 0.0856304 6.75089 0.0751739C6.32255 0.0432391 5.48579 0 4.88407 0C3.23074 0 2.15382 1.04 2.15382 2.93009V4.80435H0.269228C0.120614 4.80435 0 4.93096 0 5.08696V7.06522C0 7.22122 0.120614 7.34783 0.269228 7.34783H2.15382V12.7174C2.15382 12.8734 2.27444 13 2.42305 13H4.30765C4.45626 13 4.57688 12.8734 4.57688 12.7174V7.34783H6.52124C6.65855 7.34783 6.77378 7.23959 6.78885 7.0963L6.99831 5.11804C7.01608 4.95074 6.89116 4.80435 6.7307 4.80435H4.57688V3.3913C4.57688 2.92302 4.93845 2.54348 5.38456 2.54348Z"
            fill="#5B6871"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`menu fixed inset-0 bg-white z-50 transition-all duration-500 ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`menu__ellipse absolute w-96 h-96 rounded-full bg-gradient-to-br from-[#1BC1C1]/10 to-transparent blur-3xl -top-20 -right-20 transition-all duration-700 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      ></div>
      <div
        className={`menu__ellipse absolute w-64 h-64 rounded-full bg-gradient-to-br from-[#70efd1]/10 to-transparent blur-3xl bottom-32 left-20 transition-all duration-700 delay-100 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      ></div>

      <div className="menu__wrapper relative h-full flex items-center justify-center overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
          <button
            className={`menu-close absolute top-8 right-6 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:rotate-90 ${
              isOpen ? 'opacity-100 delay-200' : 'opacity-0'
            }`}
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-900" strokeWidth={2} />
          </button>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mt-16">
            <div
              className={`hidden lg:block menu__connect space-y-6 transition-all duration-500 ${
                isOpen ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="menu__connect-heading flex items-center gap-3">
                <span className="menu__connect-heading-icon w-2 h-2 bg-[#1BC1C1] rounded-full animate-pulse"></span>
                <span className="menu__connect-heading-text text-sm font-medium text-gray-600">
                  Kết nối với chúng tôi!
                </span>
              </div>

              <div className="menu__connect-text text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 leading-tight">
                Bạn đang cần thiết kế website? <br /> Hãy liên hệ với chúng tôi.
              </div>

              <Link
                href="/lien-he"
                onClick={onClose}
                className="cta-button inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#80d8f9] to-[#1a63a8] text-white rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
              >
                <span className="btn-text uppercase tracking-wide">LIÊN HỆ NGAY</span>
                <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div
              className={`menu__navigation transition-all duration-500 ${
                isOpen ? 'opacity-100 translate-y-0 delay-400' : 'opacity-0 translate-y-10'
              }`}
            >
              <ul className="space-y-2 flex flex-col items-center">
                {navigationItems.map((item, index) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));

                  return (
                    <li
                      key={item.name}
                      className={`transition-all duration-300 ${
                        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                      }`}
                      style={{ transitionDelay: `${300 + index * 50}ms` }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`menu__navigation-item group flex items-center gap-4 py-4 px-6 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#1BC1C1]/10 to-transparent'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className={`menu__navigation-icon w-2 h-2 rounded-full transition-all duration-300 ${
                            isActive
                              ? 'bg-[#1BC1C1] scale-100'
                              : 'bg-gray-300 scale-0 group-hover:scale-100 group-hover:bg-[#1BC1C1]'
                          }`}
                        ></span>
                        <span
                          className={`menu__navigation-text text-2xl sm:text-3xl font-medium transition-colors ${
                            isActive
                              ? 'text-gray-900'
                              : 'text-gray-600 group-hover:text-gray-900'
                          }`}
                        >
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div
            className={`menu__cta-mobile lg:hidden mt-12 transition-all duration-500 ${
              isOpen ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-10'
            }`}
          >
            <Link
              href="/lien-he"
              onClick={onClose}
              className="cta-button flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#80d8f9] to-[#1a63a8] text-white rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <span className="btn-text uppercase tracking-wide">Liên hệ</span>
              <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div
            className={`menu__socials mt-12 lg:mt-20 transition-all duration-500 ${
              isOpen ? 'opacity-100 translate-y-0 delay-600' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="menu__socials-divider h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>

            <div className="menu__socials-list flex items-center justify-center gap-6 flex-wrap">
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`menu__socials-link w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 
                    hover:bg-gradient-to-br hover:from-[#1BC1C1] hover:to-[#70efd1] text-gray-600 hover:text-white 
                    transition-all duration-300 hover:scale-110 ${
                      isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                  style={{ transitionDelay: `${600 + index * 50}ms` }}
                >
                  <span className="sr-only">{social.name}</span>
                  <div className="w-5 h-5 flex items-center justify-center">{social.icon}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
