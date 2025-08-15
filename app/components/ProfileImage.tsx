// app/components/ProfileImage.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProfileImageProps {
  src: string | null | undefined;
  alt: string;
  firstName: string;
}

export default function ProfileImage({ src, alt, firstName }: ProfileImageProps) {
  const [imageError, setImageError] = useState(false);

  const placeholderUrl = `https://placehold.co/60x60/cccccc/000000?text=${firstName ? firstName.charAt(0).toUpperCase() : '?'}`;

  if (src && !imageError) {
    return (
      <Image
        src={src}
        alt={alt}
        width={60}
        height={60}
        className="w-[60px] h-[60px] rounded-full object-cover flex-shrink-0"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div 
      className="w-[60px] h-[60px] rounded-full bg-cover bg-center flex-shrink-0"
      style={{ backgroundImage: `url(${placeholderUrl})` }}
    >
    </div>
  );
}