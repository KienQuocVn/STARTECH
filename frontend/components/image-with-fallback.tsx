import Image from 'next/image'
import React, { useMemo, useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

type ImageWithFallbackProps = Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'> & {
  src?: string | null
  alt: string
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const { src, alt, style, className, width, height, ...rest } = props

  const resolvedWidth = typeof width === 'number' ? width : 88
  const resolvedHeight = typeof height === 'number' ? height : 88
  const imageSrc = useMemo(() => {
    if (didError || !src) return ERROR_IMG_SRC
    return src
  }, [didError, src])

  return (
    <div
      className={`inline-block bg-[var(--surface-subtle)] text-center align-middle ${className ?? ''}`}
      style={style}
      data-original-url={src ?? undefined}
    >
      <Image
        src={imageSrc}
        alt={didError ? 'Error loading image' : alt}
        width={resolvedWidth}
        height={resolvedHeight}
        unoptimized={imageSrc.startsWith('data:image/')}
        className={className}
        onError={() => setDidError(true)}
        {...rest}
      />
    </div>
  )
}
