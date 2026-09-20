import { useState } from 'react'
import { Shield } from 'lucide-react'

// Image with a graceful fallback when image_url is missing or fails to load
// (mirrors the original's ResponsiveImage / ImageWrapper behavior).
export default function VehicleImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-200 text-neutral-400 ${className}`}
      >
        <Shield className="h-10 w-10" strokeWidth={1.5} />
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
