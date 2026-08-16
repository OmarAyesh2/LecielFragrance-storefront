"use client";

import { useState, useEffect } from 'react';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ReviewSection from './ReviewSection';

export default function ProductClient({ product, variants, packageItems, reviews }) {
  const [selectedVariantId, setSelectedVariantId] = useState(variants?.length > 0 ? variants[0].id : null);
  const activeVariant = variants?.find(v => v.id === selectedVariantId);

  const images = [product.image_url];
  
  if (product.gallery_images && Array.isArray(product.gallery_images)) {
    product.gallery_images.forEach(img => {
      if (img && !images.includes(img)) {
        images.push(img);
      }
    });
  }

  if (variants) {
    variants.forEach(v => {
      if (v.image_url && !images.includes(v.image_url)) {
        images.push(v.image_url);
      }
    });
  }

  const [activeImage, setActiveImage] = useState(images[0]);

  // Update active image if variant changes
  useEffect(() => {
    if (activeVariant?.image_url) {
      setActiveImage(activeVariant.image_url);
    }
  }, [activeVariant]);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="container" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-12)' }}>
      <div className="product-layout">
        <ProductGallery 
          images={images.filter(Boolean)} 
          activeImage={activeImage} 
          setActiveImage={setActiveImage} 
        />
        
        <ProductInfo 
          product={product}
          variants={variants}
          selectedVariantId={selectedVariantId}
          setSelectedVariantId={setSelectedVariantId}
          packageItems={packageItems}
          reviewsCount={reviews.length}
          avgRating={avgRating}
        />
      </div>

      <ReviewSection productId={product.id} initialReviews={reviews} />
    </div>
  );
}
