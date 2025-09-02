import Image from 'next/image'

/**
 * Wrapper component for Next.js Image that automatically applies
 * the unoptimized prop for small, vector, or animated images
 */
const OptimizedImage = ({ 
  src, 
  width, 
  height, 
  alt, 
  className,
  unoptimized: forceUnoptimized = false,
  ...props 
}) => {
  // Determine if image should be unoptimized
  const shouldUnoptimize = forceUnoptimized || 
    // Small images under 10KB (approximated by small dimensions)
    (width && height && width * height < 10000) ||
    // Vector images
    src?.toLowerCase().endsWith('.svg') ||
    // Animated images
    src?.toLowerCase().endsWith('.gif')

  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      className={className}
      unoptimized={shouldUnoptimize}
      {...props}
    />
  )
}

export default OptimizedImage