"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function ProductGallery({ images, activeImage, setActiveImage }) {
  const { t } = useLanguage();

  if (!images || images.length === 0) {
    return (
      <div className="gallery-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--color-text-tertiary)' }}>{t('product.no_image') || 'No image available'}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="gallery-main animate-scale-in">
        <img src={activeImage || images[0]} alt="Product" />
      </div>

      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((img, idx) => (
            <div 
              key={idx}
              className={`gallery-thumbnail ${activeImage === img ? 'active' : ''}`}
              onClick={() => setActiveImage(img)}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
