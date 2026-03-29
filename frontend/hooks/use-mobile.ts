import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Custom Hook: useIsMobile
 * 
 * Chức năng: Kiểm tra người dùng đang dùng thiết bị di động hay không
 * Trả về: true nếu màn hình < 768px, false nếu >= 768px
 * 
 * Lợi ích: Dễ dàng xử lý responsive logic trong component
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Lắng nghe thay đổi kích thước màn hình
    mql.addEventListener('change', onChange)
    
    // Set giá trị ban đầu
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}