"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone } from "lucide-react"

export function SocialSidebar() {
  return (
    <div className="fixed right-0 bottom-4 z-50">
      {/* Social buttons container */}
      <div className="relative mr-4 flex flex-col gap-4">
        {/* Zalo Button */}
        <div className="group relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer">
          <Image src="/icon/Zalo_icon.webp" alt="Zalo" width={40} height={40} className="h-10 w-10 object-contain" />
          
          {/* Tooltip hiển thị sdt */}
          <div className="absolute right-[120%] top-1/2 -translate-y-1/2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <div className="flex items-center gap-2 bg-[#1a63a8] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md whitespace-nowrap min-w-[160px] justify-center">
              <Phone size={18} className="text-white" /> 
              <span>0919925302</span>
            </div>
          </div>
        </div>

        {/* Messenger Button */}
        <Link
          href="https://www.facebook.com/messages/t/869421369568407"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Nhắn tin qua Messenger"
        >
          <Image src="/icon/Messenger_icon.png" alt="Messenger" width={40} height={40} className="h-10 w-10 object-contain" />
        </Link>

        {/* Facebook Button */}
        <Link
          href="https://www.facebook.com/profile.php?id=61581525345220"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Theo dõi trên Facebook"
        >
          <Image src="/icon/Facebook_icon.png" alt="Facebook" width={40} height={40} className="h-10 w-10 object-contain" />
        </Link>
      </div>
    </div>
  )
}
