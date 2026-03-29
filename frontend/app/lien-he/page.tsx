'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactForm } from '@/app/lien-he/sections/contact-form';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <section
        id="contact"
        className="flex flex-grow items-center justify-center bg-gradient-to-br from-[#c6e3ff] via-white to-[#c6e3ff] py-12 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,560px)] lg:gap-12">
            <div className="flex h-full flex-col justify-center">
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#F59E0B] sm:text-sm">
                • Kết nối với chúng tôi!
              </span>
              <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[#0B1220] sm:text-4xl md:text-5xl lg:text-6xl">
                Biến tầm nhìn của bạn thành trải nghiệm lâu dài
              </h1>

              <div className="mt-8 flex items-center gap-4 text-sm text-[#0B1220]/80 sm:mt-10 sm:text-base">
                <a href="mailto:xinchao@startech.com" className="break-all underline underline-offset-4">
                  xinchao@startech.com
                </a>
              </div>

              <div className="mt-8 flex items-center gap-3 sm:mt-10">
                {['tiktok', 'facebook', 'insta'].map((k) => (
                  <a
                    key={k}
                    href={`https://www.${k}.com/startech`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-[#0B1220]/70 transition-colors hover:bg-[#0B1220]/10 sm:h-11 sm:w-11"
                  >
                    {k === 'tiktok' && (
                      <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5.5 0V9.1C5.5 9.83454 4.90192 10.4 4.125 10.4C3.34808 10.4 2.75 9.83454 2.75 9.1C2.75 8.36546 3.34808 7.8 4.125 7.8V5.2C1.86317 5.2 0 6.96154 0 9.1C0 11.2385 1.86317 13 4.125 13C6.38683 13 8.25 11.2385 8.25 9.1V4.20215C9.0972 4.77274 9.98129 5.2 11 5.2V2.6C10.9349 2.6 9.98618 2.31522 9.32422 1.76973C8.66226 1.22423 8.25 0.539488 8.25 0H5.5Z"
                          fill="#5B6871"
                        />
                      </svg>
                    )}
                    {k === 'facebook' && (
                      <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5.38456 2.54348H6.7307C6.87931 2.54348 6.99993 2.41687 6.99993 2.26087V0.356935C6.99993 0.208848 6.89143 0.0856304 6.75089 0.0751739C6.32255 0.0432391 5.48579 0 4.88407 0C3.23074 0 2.15382 1.04 2.15382 2.93009V4.80435H0.269228C0.120614 4.80435 0 4.93096 0 5.08696V7.06522C0 7.22122 0.120614 7.34783 0.269228 7.34783H2.15382V12.7174C2.15382 12.8734 2.27444 13 2.42305 13H4.30765C4.45626 13 4.57688 12.8734 4.57688 12.7174V7.34783H6.52124C6.65855 7.34783 6.77378 7.23959 6.78885 7.0963L6.99831 5.11804C7.01608 4.95074 6.89116 4.80435 6.7307 4.80435H4.57688V3.3913C4.57688 2.92302 4.93845 2.54348 5.38456 2.54348Z"
                          fill="#5B6871"
                        ></path>
                      </svg>
                    )}
                    {k === 'insta' && (
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3.61111 0C1.62326 0 0 1.62326 0 3.61111V9.38889C0 11.3767 1.62326 13 3.61111 13H9.38889C11.3767 13 13 11.3767 13 9.38889V3.61111C13 1.62326 11.3767 0 9.38889 0H3.61111ZM3.61111 1.08333H9.38889C10.7911 1.08333 11.9167 2.20885 11.9167 3.61111V9.38889C11.9167 10.7911 10.7911 11.9167 9.38889 11.9167H3.61111C2.20885 11.9167 1.08333 10.7911 1.08333 9.38889V3.61111C1.08333 2.20885 2.20885 1.08333 3.61111 1.08333ZM10.2917 2.16667C10.148 2.16667 10.0102 2.22373 9.90865 2.32532C9.80707 2.4269 9.75 2.56467 9.75 2.70833C9.75 2.85199 9.80707 2.98977 9.90865 3.09135C10.0102 3.19293 10.148 3.25 10.2917 3.25C10.4353 3.25 10.5731 3.19293 10.6747 3.09135C10.7763 2.98977 10.8333 2.85199 10.8333 2.70833C10.8333 2.56467 10.7763 2.4269 10.6747 2.32532C10.5731 2.22373 10.4353 2.16667 10.2917 2.16667ZM6.5 2.88889C5.34144 2.88889 4.40392 3.34285 3.79308 4.03006C3.18223 4.71726 2.88889 5.61227 2.88889 6.5C2.88889 7.38773 3.18223 8.28274 3.79308 8.96994C4.40392 9.65715 5.34144 10.1111 6.5 10.1111C7.65856 10.1111 8.59608 9.65715 9.20692 8.96994C9.81777 8.28274 10.1111 7.38773 10.1111 6.5C10.1111 5.61227 9.81777 4.71726 9.20692 4.03006C8.59608 3.34285 7.65856 2.88889 6.5 2.88889ZM6.5 3.97222C7.38773 3.97222 7.98494 4.28562 8.39724 4.74946C8.80955 5.2133 9.02778 5.85301 9.02778 6.5C9.02778 7.14699 8.80955 7.7867 8.39724 8.25054C7.98494 8.71438 7.38773 9.02778 6.5 9.02778C5.61227 9.02778 5.01506 8.71438 4.60276 8.25054C4.19045 7.7867 3.97222 7.14699 3.97222 6.5C3.97222 5.85301 4.19045 5.2133 4.60276 4.74946C5.01506 4.28562 5.61227 3.97222 6.5 3.97222Z"
                          fill="#5B6871"
                        ></path>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex h-full items-center justify-center">
              <Card className="w-full max-w-3xl rounded-3xl border-0 bg-white/70 shadow-xl backdrop-blur-lg">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-2xl text-[#0B1220] sm:text-3xl">LIÊN HỆ NGAY</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Điền thông tin, chúng tôi sẽ liên hệ trong thời gian sớm nhất.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
