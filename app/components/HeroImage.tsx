"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function HeroImage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Image
      src={isMobile ? "/white-rose-flower-red-tablecloth-blue-mobile.jpg" : "/white-rose-flower-red-tablecloth-blue.jpg"}
      alt="Hero background - Fleurs élégantes pour Flocon"
      fill
      className="object-cover"
      priority={true}
      quality={90}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
    />
  );
}
