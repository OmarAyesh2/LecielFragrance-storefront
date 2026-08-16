"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ReviewForm({ productId, onReviewAdded }) {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <div className="review-form" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <p style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
          {lang === 'ar' ? 'يجب تسجيل الدخول لكتابة تقييم.' : 'You must be signed in to write a review.'}
        </p>
        <Link href="/auth/signin" className="btn-secondary">
          {t('nav.signIn') || 'Sign In'}
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const newReview = {
        product_id: productId,
        user_id: user.id,
        reviewer_name: profile?.full_name || 'Anonymous',
        rating,
        comment,
      };

      const { data, error: submitError } = await supabase
        .from('reviews')
        .insert(newReview)
        .select()
        .single();

      if (submitError) throw submitError;

      onReviewAdded(data);
      setComment('');
      setRating(5);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(lang === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="review-form animate-fade-in" onSubmit={handleSubmit}>
      <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
        {lang === 'ar' ? 'اكتب تقييماً' : 'Write a Review'}
      </h3>
      
      {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-4)' }}>{error}</div>}

      <div className="star-rating-input">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= rating ? 'active' : ''}`}
            onClick={() => setRating(star)}
          >
            ★
          </button>
        ))}
      </div>

      <div className="form-group">
        <label className="form-label">{lang === 'ar' ? 'تعليقك' : 'Your Review'}</label>
        <textarea 
          className="form-textarea" 
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={lang === 'ar' ? 'شاركنا رأيك...' : 'Share your thoughts...'}
        ></textarea>
      </div>

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting 
          ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') 
          : (lang === 'ar' ? 'إرسال التقييم' : 'Submit Review')
        }
      </button>
    </form>
  );
}
