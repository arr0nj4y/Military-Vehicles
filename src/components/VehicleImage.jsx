import { useState } from 'react'
import { Crosshair } from 'lucide-react'

// Image with a graceful fallback when image_url is missing or fails to load
// (mirrors the original's ResponsiveImage / ImageWrapper behavior).
export default function VehicleImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`image-wash relative flex items-center justify-center overflow-hidden text-white/60 ${className}`}
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(135deg, transparent 45%, rgba(255,255,255,.4) 46%, transparent 47%), linear-gradient(45deg, transparent 45%, rgba(255,255,255,.18) 46%, transparent 47%)', backgroundSize: '22px 22px' }} />
        <div className="relative flex flex-col items-center gap-2">
          <Crosshair className="h-9 w-9" strokeWidth={1.2} />
          <span className="military-label text-[8px] font-semibold uppercase">Image unavailable</span>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}
