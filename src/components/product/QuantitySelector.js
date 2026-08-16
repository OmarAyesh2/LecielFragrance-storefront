"use client";

export default function QuantitySelector({ quantity, setQuantity, max }) {
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < max) setQuantity(quantity + 1);
  };

  return (
    <div className="qty-controls" style={{ padding: 'var(--space-2)' }}>
      <button 
        className="qty-btn" 
        onClick={handleDecrease}
        disabled={quantity <= 1 || max === 0}
      >
        -
      </button>
      <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 600 }}>
        {quantity}
      </span>
      <button 
        className="qty-btn" 
        onClick={handleIncrease}
        disabled={quantity >= max || max === 0}
      >
        +
      </button>
    </div>
  );
}
