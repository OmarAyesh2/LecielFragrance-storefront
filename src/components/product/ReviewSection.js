"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import ReviewForm from './ReviewForm';

export default function ReviewSection({ productId, initialReviews }) {
  const { lang, t } = useLanguage();
  const [reviews, setReviews] = useState(initialReviews || []);

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="reviews-section" id="reviews">
      <div className="reviews-header">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)' }}>
          {lang === 'ar' ? 'آراء العملاء' : 'Customer Reviews'}
        </h2>
        {reviews.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span className="stars">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>
            <span style={{ fontWeight: 600 }}>{avgRating} / 5</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>({reviews.length})</span>
          </div>
        )}
      </div>

      <ReviewForm productId={productId} onReviewAdded={handleReviewAdded} />

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-secondary)' }}>
            {lang === 'ar' ? 'لا توجد تقييمات بعد. كن الأول!' : 'No reviews yet. Be the first!'}
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card animate-fade-in-up">
              <div className="review-header">
                <div className="reviewer-name">{review.reviewer_name}</div>
                <div className="review-date">
                  {new Date(review.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="stars" style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <div className="review-comment">
                {review.comment}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
